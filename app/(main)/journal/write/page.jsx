"use client";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from "@/app/lib/schema";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMoodById, MOODS } from "@/app/lib/mood";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import {
  createJournalEntry,
  getDraft,
  getJournalEntry,
  saveDraft,
  updateEntry,
} from "@/actions/journal";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createCollection, getCollections } from "@/actions/collection";
import CollectionForm from "@/components/CollectionForm";
import { Loader2 } from "lucide-react";

const JournalEntryPage = () => {
  const router = useRouter();
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    loading: entryLoading,
    fn: fetchEntry,
    data: existingEntry,
  } = useFetch(getJournalEntry);

  const {
    loading: draftLoading,
    fn: fetchDraft,
    data: draftData,
  } = useFetch(getDraft);

  const {
    loading: savingDraft,
    fn: saveDraftFn,
    data: savedDraft,
  } = useFetch(saveDraft);

  const {
    loading: createEntryLoading,
    fn: createEntryFn,
    data: createdEntry,
  } = useFetch(isEditMode ? updateEntry : createJournalEntry);

  const {
    loading: collectionsLoading,
    fn: fetchCollections,
    data: collections,
  } = useFetch(getCollections);

  const {
    loading: createCollectionsLoading,
    fn: createCollectionsFn,
    data: createdCollection,
  } = useFetch(createCollection);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    },
  });
  useEffect(() => {
    fetchCollections();
    if (editId) {
      setIsEditMode(true);
      fetchEntry();
    } else {
      setIsEditMode(false);
      fetchDraft();
    }
  }, [editId]);
  useEffect(() => {
    if (isEditMode && existingEntry) {
      reset({
        title: existingEntry.title || "",
        content: existingEntry.content || "",
        mood: existingEntry.mood || "",
        collectionId: existingEntry.collectionId || "",
      });
    } else if (draftData?.success && draftData?.data) {
      reset({
        title: draftData.data.title || "",
        content: draftData.data.content || "",
        mood: draftData.data.mood || "",
        collectionId: "",
      });
    } else {
      reset({
        title: "",
        content: "",
        mood: "",
        collectionId: "",
      });
    }
  }, [draftData, isEditMode, existingEntry]);

  useEffect(() => {
    if (createdEntry && !createEntryLoading) {
      if (!isEditMode && draftData) {
        saveDraftFn({ title: "", content: "", mood: "" });
      }
      router.push(
        `/collection/${
          createdEntry.collectionId ? createdEntry.collectionId : "unorganized"
        }`
      );
      toast.success(`Entry ${isEditMode ? "Updated" : "Created"} sucessfully`);
    }
  }, [createdEntry, createEntryLoading]);

  const onSubmit = handleSubmit(async (data) => {
    const mood = getMoodById(data.mood);
    createEntryFn({
      ...data,
      moodScore: mood.score,
      ...(isEditMode && { id: editId }),
    });
  });
  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);
      fetchCollections();
      setValue("collectionId", createdCollection.id);
      toast.success(`Collection ${createdCollection.name} created!`);
    }
  }, [createdCollection]);
  const handleCreateCollection = async (data) => {
    createCollectionsFn(data);
  };
  const formData = watch();
  const handleDraft = async () => {
    if (!isDirty) {
      toast.error("No Changes to save");
      return;
    }
    await saveDraftFn(formData);
  };
  useEffect(() => {
    if (savedDraft?.success && !savingDraft) {
      toast.success("Draft Saved successfully");
    }
  }, [savedDraft, savingDraft]);
  const isLoading =
    createEntryLoading ||
    collectionsLoading ||
    entryLoading ||
    draftLoading ||
    savingDraft;
  const selectedMood = watch("mood");

  return (
    <div className="py-8 ">
      <form className="space-y-7 mx-auto" onSubmit={onSubmit}>
        <h1 className="text-4xl md:text-5xl font-custom uppercase text-gradient-xl ">
          {isEditMode ? "Edit Entry" : `What's on your mind ?`}
        </h1>

        {isLoading && (
          <BarLoader color="blue" width={"100%"} className="my-3" />
        )}
        <div className="space-y-3 ">
          <label className="text-xl font-bold">Title</label>
          <Input
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`py-5 text-xl placeholder:text-xl border-blue-300 border-2 shadow-md ${
              errors.title ? "border-red-500" : ""
            }`}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xl font-bold">How are you feeling?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => {
              return (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`py-5 text-xl border-amber-200 border-2 shadow-lg  ${
                      errors.mood ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a mood..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MOODS).map((mood) => {
                      return (
                        <SelectItem key={mood.id} value={mood.id}>
                          <span className="flex items-center gap-2 text-lg font-bold">
                            {mood.emoji} {mood.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.mood && (
            <p className="text-red-500 text-sm">{errors.mood.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xl font-bold">
            {getMoodById(selectedMood)?.prompt ?? "Write your thoughts..."}
          </label>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                readOnly={isLoading}
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [("blockquote", "code-block")],
                    ["link"],
                  ],
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xl font-bold">
            Add to Collection (optional)
          </label>
          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (value == "new") {
                      setIsCollectionDialogOpen(true);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger className=" border-blue-200 border-2 shadow-lg  py-5 text-xl ">
                    <SelectValue placeholder="Choose a collection.." />
                  </SelectTrigger>
                  <SelectContent>
                    {collections?.map((collection) => {
                      return (
                        <SelectItem
                          className="text-lg font-bold"
                          key={collection.id}
                          value={collection.id}
                        >
                          {collection.name}
                        </SelectItem>
                      );
                    })}
                    <SelectItem value="new">
                      <span className="text-blue-600 hover:text-amber-600 text-md font-semibold">
                        + Create a New Collection
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.mood && (
            <p className="text-red-500 text-sm">{errors.mood.message}</p>
          )}
        </div>
        <div className="space-x-4">
          {!isEditMode && (
            <Button
              onClick={handleDraft}
              variant="outline"
              type="button"
              disabled={savingDraft || !isDirty}
              className="font-bold text-md"
            >
              {savingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
          )}
          <Button
            disabled={createEntryLoading || !isDirty}
            type="submit"
            variant="journal"
            className="font-bold text-md"
          >
            {isEditMode ? "Update" : "Publish"}
          </Button>
          {isEditMode && (
            <Button
              className="font-bold text-md"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${existingEntry.id}`);
              }}
              variant="destructive"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      <CollectionForm
        loading={createCollectionsLoading}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionDialogOpen}
      />
    </div>
  );
};
export default JournalEntryPage;
