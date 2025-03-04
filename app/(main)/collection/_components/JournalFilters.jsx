"use client";

import { MOODS } from "@/app/lib/mood";
import EntryCard from "@/components/EntryCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

const JournalFilters = ({ entries }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectMood, setSelectMood] = useState("");
  const [date, setDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const clearFilters = () => {
    setSearchQuery("");
    setSelectMood("");
    setDate(null);
  };
  useEffect(() => {
    let filtered = entries;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query)
      );
    }
    if (selectMood) {
      filtered = filtered.filter((entry) => entry.mood === selectMood);
    }

    if (date) {
      filtered = filtered.filter((entry) =>
        isSameDay(new Date(entry.createdAt), date)
      );
    }
    setFilteredEntries(filtered);
  }, [entries, searchQuery, selectMood, date]);
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xl placeholder:text-lg"
          />
        </div>
        <Select onValueChange={setSelectMood} value={selectMood}>
          <SelectTrigger className="w-[150px] font-bold text-md">
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MOODS).map((mood) => {
              return (
                <SelectItem key={mood.id} value={mood.id}>
                  <span className="flex items-center gap-2 font-bold text-md">
                    {mood.emoji} {mood.label}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left text-md font-bold",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(searchQuery || selectMood || date) && (
          <Button
            variant="ghost"
            className="text-blue-600 font-bold text-md"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="text-sm font-semibold text-gray-700">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>
      {filteredEntries.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-700 text-2xl font-bold">No entries found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
};
export default JournalFilters;
