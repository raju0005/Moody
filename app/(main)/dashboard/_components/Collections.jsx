"use client";

import { useEffect, useState } from "react";
import CollectionPreview from "./CollectionPreview";
import CollectionForm from "@/components/CollectionForm";
import useFetch from "@/hooks/use-fetch";
import { createCollection } from "@/actions/collection";
import { toast } from "sonner";

const Collections = ({ collections = [], entriesByCollection }) => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const {
    loading: createCollectionsLoading,
    fn: createCollectionsFn,
    data: createdCollection,
  } = useFetch(createCollection);
  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);

      toast.success(`Collection ${createdCollection.name} created!`);
    }
  }, [createdCollection]);
  const handleCreateCollection = async (data) => {
    createCollectionsFn(data);
  };
  if (collections.length === 0) return <></>;
  return (
    <section id='collections' className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-custom uppercase text-gradient-xl ">Collections</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CollectionPreview
          isCreateNew={true}
          onCreateNew={() => setIsCollectionDialogOpen(true)}
        />
        {entriesByCollection?.unorganized?.length > 0 && (
          <CollectionPreview
            name="Unorganized"
            entries={entriesByCollection.unorganized}
            isUnorganized={true}
          />
        )}
        {collections.map((collection) => (
          <CollectionPreview
            key={collection.id}
            id={collection.id}
            name={collection.name}
            entries={entriesByCollection[collection.id] || []}
          />
        ))}
        <CollectionForm
          loading={createCollectionsLoading}
          onSuccess={handleCreateCollection}
          open={isCollectionDialogOpen}
          setOpen={setIsCollectionDialogOpen}
        />
      </div>
    </section>
  );
};
export default Collections;
