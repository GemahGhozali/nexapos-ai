import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/libs/supabase/admin";
import { ENVIRONMENT } from "@/config/env";
import { getMidtransTransactionStatus } from "@/libs/midtrans";
import { requireEnv } from "@/utils/env";

const NotificationSchema = z.object({
  order_id: z.string().min(1),
  transaction_id: z.string().min(1),
  transaction_status: z.string().min(1),
  gross_amount: z.string().min(1),
  status_code: z.string().min(1),
  signature_key: z.string().min(1),
  payment_type: z.string().optional(),
  fraud_status: z.string().optional(),
  transaction_time: z.string().optional(),
  settlement_time: z.string().optional(),
});

type Notification = z.infer<typeof NotificationSchema>;

function isValidSignature(notification: Notification): boolean {
  requireEnv("MIDTRANS_SERVER_KEY");

  const expected = createHash("sha512")
    .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${ENVIRONMENT.MIDTRANS_SERVER_KEY}`)
    .digest("hex");
  const received = Buffer.from(notification.signature_key, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
}

function parseMidtransTime(value?: string): string | null {
  if (!value) return null;

  const normalizedValue = /([+-]\d{2}:?\d{2}|Z)$/.test(value) ? value : `${value.replace(" ", "T")}+07:00`;
  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isFinalStatus(status: string, fraudStatus?: string): boolean {
  return status === "settlement" || (status === "capture" && fraudStatus === "accept");
}

export async function POST(request: Request) {
  try {
    const payload = NotificationSchema.safeParse(await request.json());

    if (!payload.success) {
      return Response.json({ message: "Payload notifikasi Midtrans tidak valid." }, { status: 400 });
    }

    const notification = payload.data;

    if (!isValidSignature(notification)) {
      return Response.json({ message: "Signature notifikasi Midtrans tidak valid." }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: payment, error: paymentError } = await supabase
      .from("midtrans_payments")
      .select("id, order_id, total_amount, payment_status, transaction_id")
      .eq("order_id", notification.order_id)
      .maybeSingle();

    if (paymentError) {
      console.error("Midtrans notification lookup failed:", paymentError);
      return Response.json({ message: "Gagal membaca payment Midtrans." }, { status: 500 });
    }

    if (!payment) {
      return Response.json({ message: "Order Midtrans tidak ditemukan." }, { status: 404 });
    }

    if (Number(notification.gross_amount) !== Number(payment.total_amount)) {
      return Response.json({ message: "Nominal pembayaran Midtrans tidak sesuai." }, { status: 400 });
    }

    const statusResponse = await getMidtransTransactionStatus(notification.transaction_id);
    const status = statusResponse.transaction_status ?? notification.transaction_status;
    const fraudStatus = statusResponse.fraud_status ?? notification.fraud_status;

    if (statusResponse.order_id && statusResponse.order_id !== notification.order_id) {
      return Response.json({ message: "Order ID Midtrans tidak sesuai." }, { status: 400 });
    }

    const providerResponse = { notification, status: statusResponse };

    if (!isFinalStatus(status, fraudStatus)) {
      const { error: updateError } = await supabase
        .from("midtrans_payments")
        .update({
          payment_status: status,
          midtrans_transaction_id: notification.transaction_id,
          midtrans_payment_type: statusResponse.payment_type ?? notification.payment_type,
          fraud_status: fraudStatus,
          status_code: statusResponse.status_code ?? notification.status_code,
          transaction_time: parseMidtransTime(statusResponse.transaction_time ?? notification.transaction_time),
          settlement_time: parseMidtransTime(statusResponse.settlement_time ?? notification.settlement_time),
          midtrans_response: providerResponse,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id)
        .is("transaction_id", null);

      if (updateError) {
        console.error("Midtrans non-final status update failed:", updateError);
        return Response.json({ message: "Gagal memperbarui status payment Midtrans." }, { status: 500 });
      }

      return Response.json({ received: true });
    }

    const { data: transactionId, error: finalizeError } = await supabase.rpc("finalize_midtrans_payment", {
      p_order_id: notification.order_id,
      p_midtrans_transaction_id: notification.transaction_id,
      p_payment_type: statusResponse.payment_type ?? notification.payment_type ?? null,
      p_payment_status: status,
      p_fraud_status: fraudStatus ?? null,
      p_status_code: statusResponse.status_code ?? notification.status_code,
      p_transaction_time: parseMidtransTime(statusResponse.transaction_time ?? notification.transaction_time),
      p_settlement_time: parseMidtransTime(statusResponse.settlement_time ?? notification.settlement_time),
      p_midtrans_response: providerResponse,
    });

    if (finalizeError) {
      console.error("Midtrans payment finalization failed:", finalizeError);
      return Response.json({ message: "Gagal memfinalisasi transaksi Midtrans." }, { status: 500 });
    }

    return Response.json({ received: true, transactionId });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    return Response.json({ message: "Terjadi kesalahan saat memproses notifikasi Midtrans." }, { status: 500 });
  }
}
