import { Button } from "@/components/ui/button";
import { Product } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteProduct } from "../hooks";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function DeleteProductDialog({ product, onClose }: DeleteProductDialogProps) {
  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = async () => {
    if (!product) return;
    await deleteProduct(product.id);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Apakah anda yakin?</DialogTitle>
          <DialogDescription>{product ? `Produk "${product.name}"` : "Produk"} akan dihapus secara permanen!</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
            }
          />
          <Button variant="destructive" type="button" disabled={isPending} onClick={handleDelete}>
            {isPending ? "Processing" : "Hapus Produk"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
