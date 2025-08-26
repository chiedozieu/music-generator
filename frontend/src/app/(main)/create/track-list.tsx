"use client";


import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";


export interface Track {
  id: string;
  title: string | null;
  createdAt: Date;
  instrumental: boolean;
  prompt: string | null;
  lyrics: string | null;
  describedLyrics: string | null;
  fullDescribedSong: string | null;
  thumbnailUrl: string | null;
  playUrl: string | null;
  status: string | null;
  createdByUserName: string | null;
  published: boolean;
}
export function TrackList({ tracks }: { tracks: Track[] }) {
  return <div className="flex flex-1 flex-col overflow-y-scroll">
    <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
            <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input placeholder="Search..." className="pl-10" />
            </div>
        </div>
    </div>
  </div>;
}
