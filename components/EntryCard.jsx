import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";

const EntryCard = ({ entry }) => {
    
  return (
    <Link href={`/journal/${entry.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl  ">{entry.moodData.emoji}</span>
                <h2 className="font-bold text-xl">{entry.title}</h2>
              </div>
              <div
                className="text-gray-600 line-clamp-2 font-custom1 text-3xl"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </div>
            <time className="text-sm text-gray-500">
              {format(new Date(entry.createdAt), "MMM d,yyyy")}
            </time>
          </div>
          {entry.Collection && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-md font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {entry.Collection.name }
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
export default EntryCard;
