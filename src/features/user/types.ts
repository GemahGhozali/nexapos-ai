export type User = {
  id: string;
  fullname: string;
  email: string;
  role: "admin" | "cashier";
  profileImage: string | null;
};
