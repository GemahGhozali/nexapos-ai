import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser } from "../hooks";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteUserDialogProps {
  user: User | null;
  onClose: () => void;
}

export function DeleteUserDialog({ user, onClose }: DeleteUserDialogProps) {
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

  const handleDelete = async () => {
    if (!user) return;
    await deleteUser(user.id);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Apakah anda yakin?</DialogTitle>
          <DialogDescription>{user ? `Pengguna "${user.fullname}"` : "Pengguna"} akan dihapus secara permanen!</DialogDescription>
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
            {isPending ? "Processing" : "Hapus Pengguna"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
