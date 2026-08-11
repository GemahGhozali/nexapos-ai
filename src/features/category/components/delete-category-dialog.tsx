import { Button } from "@/components/ui/button";
import { Category } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteCategory } from "../hooks";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteCategoryDialogProps {
  open: boolean;
  category?: Category;
  onClose: () => void;
}

export function DeleteCategoryDialog({ open, category, onClose }: DeleteCategoryDialogProps) {
  const { mutateAsync: deleteProduct, isPending } = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;
    await deleteProduct(category.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Apakah anda yakin?</DialogTitle>
          <DialogDescription>{category ? `Kategori "${category.name}"` : "Kategori"} akan dihapus secara permanen!</DialogDescription>
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
            {isPending ? "Memproses" : "Hapus Kategori"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
