export const dynamic = "force-dynamic";
import { getCollections } from "@/actions/collection";
import { getJournalEntries } from "@/actions/journal";
import Collections from "./_components/Collections";
import Mood_Analytics from "./_components/Mood_Analytics";

const DashBoard = async () => {
  const collections = await getCollections();
  const entriesData = await getJournalEntries();

  const entriesByCollection = entriesData?.data?.entries.reduce(
    (acc, entry) => {
      const collectionId = entry.collectionId || "unorganized";
      if (!acc[collectionId]) {
        acc[collectionId] = [];
      }
      acc[collectionId].push(entry);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8 px-4 py-8">
      <section className="space-y-4">
        <Mood_Analytics />
      </section>
      <Collections
        collections={collections}
        entriesByCollection={entriesByCollection}
      />
    </div>
  );
};
export default DashBoard;
