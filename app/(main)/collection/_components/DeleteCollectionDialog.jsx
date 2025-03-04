"use client";
import { deleteCollection } from "@/actions/collection";
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
import useFetch from "@/hooks/use-fetch";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DeleteCollectionDialog = ({ collection, entriesCount = 0 }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    loading: isDeleting,
    fn: deleteCollectionFn,
    data: deletedCollection,
  } = useFetch(deleteCollection);
  const handleDelete = () => {
    deleteCollectionFn(collection.id);
  };
  useEffect(() => {
    if (deletedCollection && !isDeleting) {
      setOpen(false);
      toast.error(
        `Collection "${collection.name}" and all its entries deleted `
      );
      router.push("/dashboard");
    }
  }, [deletedCollection, isDeleting]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className='font-bold text-md '>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle >
            Delete &quot; {collection.name} &quot;?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <p className="font-semibold text-red-600">
          This action cannot be undone
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel className='font-bold text-md '>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 font-bold text-md"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Collection"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteCollectionDialog;
