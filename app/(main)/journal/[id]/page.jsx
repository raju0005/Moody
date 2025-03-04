import { getJournalEntry } from "@/actions/journal";
import { getMoodById } from "@/app/lib/mood";
import { format } from "date-fns";
import Image from "next/image";
import EditButton from "./_components/EditButton";
import DeleteEntryDialog from "./_components/DeleteDialog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const JournalEntryPage = async ({ params }) => {
  const { id } = await params;
  const entry = await getJournalEntry(id);
  const mood = getMoodById(entry.mood);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-custom uppercase text-gradient-xl ">
                {entry.title}
              </h1>
              <p className="text-gray-500 text-md font-semibold">
                Created{format(new Date(entry.createdAt), "PPP")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <EditButton entryId={entry.id} />
              <DeleteEntryDialog entryId={entry.id} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.Collection && (
              <Link href={`/collection/${entry.Collection.id}`}>
                <Badge className="py-1 px-3 text-sm">{entry.Collection.name}</Badge>
              </Link>
            )}
            <Badge
            className='py-1 px-3 text-sm'
              variant="outline"
              style={{
                backgroundColor: `var(--${mood?.color}-50)`,
                color: `var(--${mood?.color}-700)`,
                borderColor: `var(--${mood?.color}-200)`,
              }}
            >
              Feeling {mood?.label}
            </Badge>
          </div>
        </div>
        <hr />
        <div className="ql-snow">
          <div
            className="ql-editor font-custom1 md:text-4xl text-3xl"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>
        <div className="text-gray-500 pt-4 border-t font-medium text-md">
          Last updated {format(new Date(entry.updatedAt), "PPP 'at' p ")}
        </div>
      </div>
    </>
  );
};
export default JournalEntryPage;
