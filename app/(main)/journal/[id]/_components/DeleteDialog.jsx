"use client";
import { deleteEntry } from "@/actions/journal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import useFetch from "@/hooks/use-fetch";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DeleteEntryDialog = ({ entryId }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    loading: isDeleting,
    fn: deleteEntryFn,
    data: deletedEntry,
  } = useFetch(deleteEntry);
  const handleDelete = () => {
    deleteEntryFn(entryId);
  };
  useEffect(() => {
    if (deletedEntry && !isDeleting) {
      setDeleteDialogOpen(false);
      toast.error(`Entry  deleted successfully`);
      router.push(
        `/collection/${
          deletedEntry.collectionId ? deletedEntry.collectionId : "unorganized"
        }`
      );
    }
  }, [deletedEntry, isDeleting]);

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="font-bold text-md">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">
            Are you Sure?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="font-semibold text-md text-red-600">
          This action cannot be undone. This will permanently delete your entry.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-bold text-md">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 font-bold text-md"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Entry"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteEntryDialog;
