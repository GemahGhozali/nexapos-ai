import { CartItemInput } from "./schemas";
import { SupabaseClient } from "@supabase/supabase-js";

type ProductMap = Map<string, { id: string; name: string; price: number; hpp: number }>;

export async function getProductInDatabaseByCartItems({ supabase, items }: { supabase: SupabaseClient; items: CartItemInput[] }) {
  try {
    const allProductId = items.map((item) => item.productId);

    const { data, error } = await supabase.from("products").select("id, name, price, hpp").in("id", allProductId);

    if (error) {
      console.log("❌ Create Transaction Error | Get Product In Database By Cart Items :", error);
      return { data: null, error: "Terjadi kesalahan di server saat memvalidasi data produk! Silahkan coba lagi nanti." };
    }

    return { data, error: null };
  } catch (error) {
    console.log("❌ Create Transaction Error | Get Product In Database By Cart Items :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

export function validateCartItems({ productMap, items }: { productMap: ProductMap; items: CartItemInput[] }) {
  const isAllItemValid = items.every((item) => productMap.has(item.productId));

  if (!isAllItemValid) {
    return { error: "Terdapat produk yang tidak valid! Silahkan periksa kembali produk didalam keranjang." };
  }

  return { error: null };
}

export function generateTransactionDetails({ productMap, items }: { productMap: ProductMap; items: CartItemInput[] }) {
  return items.map((item) => {
    const product = productMap.get(item.productId)!;
    const itemSubtotal = product.price * item.quantity;

    return {
      productId: product.id,
      productName: product.name,
      priceAtSale: product.price,
      hppAtSale: product.hpp,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });
}
