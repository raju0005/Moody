"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionSchema } from "@/app/lib/schema";
import { BarLoader } from "react-spinners";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const CollectionForm = ({ onSuccess, loading, open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    onSuccess(data);
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-lg">Create a Collection</DialogTitle>
        </DialogHeader>
        {loading && <BarLoader color="blue" width={"100%"} />}
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="space-y-2">
            <label className="text-md font-semibold">Collection Name</label>
            <Input
              {...register("name")}
              placeholder="Give your Collection a Name..."
              className={`text-xl  placeholder:text-lg ${errors.name ? "border-red-500" : ""}`}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-md">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-md font-semibold">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Describe your Collection..."
              className={`text-xl  placeholder:text-lg  ${errors.description ? "border-red-500" : ""}`}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className='font-bold text-md'
            >
              Cancel
            </Button>
            <Button type="submit" variant="journal" className='text-lg font-bold'>
              Create a Collection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CollectionForm;
