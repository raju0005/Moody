import { getSingleCollection } from "@/actions/collection";
import { getJournalEntries } from "@/actions/journal";
import DeleteCollectionDialog from "../_components/DeleteCollectionDialog";
import JournalFilters from "../_components/JournalFilters";

const CollectionPage = async ({ params }) => {
  const { collectionId } = await params;
  const entries = await getJournalEntries({ collectionId });

  const collection =
    collectionId !== "unorganized" ? await getSingleCollection(collectionId) : null;

  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl md:text-5xl  font-custom uppercase text-gradient-xl ">
            {collectionId === "unorganized"
              ? "Unorganized Entries"
              : collection?.name || "Collection"}
          </h1>
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={entries?.data?.entries?.length || 0}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-light pl-1">{collection?.description}</h2>
        )}
      </div>
      <JournalFilters entries={entries?.data?.entries || []} />
    </div>
  );
};

export default CollectionPage;
