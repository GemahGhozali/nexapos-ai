import "server-only";

import midtransClient from "midtrans-client";
import { ENVIRONMENT } from "@/config/env";
import { requireEnv } from "@/utils/env";

type SnapTransactionParameter = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
};

export type SnapTransactionResponse = {
  token: string;
  redirect_url: string;
};

export type MidtransStatusResponse = {
  order_id?: string;
  transaction_id?: string;
  transaction_status?: string;
  payment_type?: string;
  fraud_status?: string;
  status_code?: string;
  gross_amount?: string;
  transaction_time?: string;
  settlement_time?: string;
};

function getSnapClient() {
  requireEnv("MIDTRANS_SERVER_KEY", "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY");

  return new midtransClient.Snap({
    isProduction: ENVIRONMENT.MIDTRANS_IS_PRODUCTION,
    serverKey: ENVIRONMENT.MIDTRANS_SERVER_KEY as string,
    clientKey: ENVIRONMENT.MIDTRANS_CLIENT_KEY as string,
  });
}

function getCoreApiClient() {
  requireEnv("MIDTRANS_SERVER_KEY", "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY");

  return new midtransClient.CoreApi({
    isProduction: ENVIRONMENT.MIDTRANS_IS_PRODUCTION,
    serverKey: ENVIRONMENT.MIDTRANS_SERVER_KEY as string,
    clientKey: ENVIRONMENT.MIDTRANS_CLIENT_KEY as string,
  });
}

export async function createSnapTransaction(parameter: SnapTransactionParameter): Promise<SnapTransactionResponse> {
  const response = await getSnapClient().createTransaction(parameter);

  if (!response?.token || !response?.redirect_url) {
    throw new Error("Midtrans tidak mengembalikan token pembayaran yang valid.");
  }

  return {
    token: response.token,
    redirect_url: response.redirect_url,
  };
}

export async function getMidtransTransactionStatus(transactionId: string): Promise<MidtransStatusResponse> {
  const client = getCoreApiClient() as unknown as {
    transaction: { status: (id: string) => Promise<MidtransStatusResponse> };
  };

  const clientTest = getCoreApiClient();

  const response = await client.transaction.status(transactionId);
  return response as MidtransStatusResponse;
}
