import { FilteredList } from "./filtered-list";
import { ChangelogEntry } from "@/types/entry";

export function ChangelogList({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className="space-y-8">
      <FilteredList entries={entries} />
    </div>
  );
}