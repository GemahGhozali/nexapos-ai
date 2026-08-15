import * as z from "zod";

export const OpeningShiftSchema = z.object({
  openingCash: z.coerce
    .number<number>("Modal kas awal wajib diisi!")
    .int("Modal kas awal harus bilangan bulat!")
    .min(0, "Modal kas awal tidak boleh minus!"),
});

export const ClosingShiftSchema = z.object({
  closingCash: z.coerce
    .number<number>("Uang kas fisik saat ini diisi!")
    .int("Uang kas fisik saat ini harus bilangan bulat!")
    .min(0, "Uang kas fisik saat ini tidak boleh minus!"),
});

export type OpeningShiftInput = z.infer<typeof OpeningShiftSchema>;
export type ClosingShiftInput = z.infer<typeof ClosingShiftSchema>;
