import { ProductForm } from "@/features/product/components/product-form";
import { getProductById } from "@/features/product/queries";

interface UpdateProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateProductPage({ params }: UpdateProductPageProps) {
  const { id } = await params;
  const { data: product, error } = await getProductById(id);

  if (!product) throw new Error(error);

  return <ProductForm product={product} />;
}
