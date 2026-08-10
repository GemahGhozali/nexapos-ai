import { QueryResponse, ActionResponse } from "@/types";

/**
 * Higher-Order Helper untuk mengeksekusi Query Function yang mengembalikan `QueryResponse<T>`.
 * Jika terdapat error / tidak ada data, fungsi ini akan melempar (throw) objek `QueryResponse`,
 * sehingga error dapat terdeteksi dan kompatibel dengan TanStack Query (`useQuery`).
 */
export async function runQuery<T>(queryFn: () => Promise<QueryResponse<T>>): Promise<T> {
  const response = await queryFn();
  if (response.error || !response.data) {
    throw new Error(`${response.error}`);
  }
  return response.data;
}

/**
 * Higher-Order Helper untuk mengeksekusi Server Action yang mengembalikan `ActionResponse`.
 * Jika `success` bernilai `false`, fungsi ini akan melempar (throw) objek `ActionResponse`,
 * agar dapat ditangkap oleh callback `onError` milik TanStack Query (`useMutation`).
 */
export async function runAction(actionFn: () => Promise<ActionResponse>): Promise<ActionResponse> {
  const response = await actionFn();
  if (!response.success) throw response;
  return response;
}
