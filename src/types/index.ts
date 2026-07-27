export type ErrorFields = Record<string, string>;

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: ErrorFields;
};

export type QueryResponse<T> = {
  data: T | null;
  error: string | null;
};
