import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser } from "../hooks";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteUserDialogProps {
  user: User | null;
  onClose: () => void;
}

export default function DeleteUserDialog({ user, onClose }: DeleteUserDialogProps) {
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
          <DialogTitle>Delete User Account</DialogTitle>
          <DialogDescription>{user ? `${user.fullname}'s account` : "User's account"} will be deleted permanently</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            }
          />
          <Button variant="destructive" type="button" disabled={isPending} onClick={handleDelete}>
            {isPending ? "Processing" : "Delete User"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
