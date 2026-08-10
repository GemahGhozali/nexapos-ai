export type Product = {
  id: string;
  name: string;
  price: number;
  hpp: number;
  image: string | null;
  category: { id: string; name: string } | null;
};
