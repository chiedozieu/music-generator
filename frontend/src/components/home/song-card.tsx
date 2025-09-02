"use client";

import type { Category, Song } from "@prisma/client";
import { Music } from "lucide-react";
import { useState } from "react";
import { getPlayUrl } from "~/actions/generation";
import { usePlayerStore } from "~/stores/e-player-store";

type SongWithRelation = Song & {
  user: { name: string | null };
  _count: { likes: number };
  categories: Category[];
  thumbnailUrl?: string | null
};
export function SongCard({ song }: { song: SongWithRelation }) {
  const [isLoading, setIsLoading] = useState(false);

  const setTrack = usePlayerStore((state) => state.setTrack);

  const handlePlay = async () => {
    setIsLoading(true);
    const playUrl = await getPlayUrl(song.id);

    setTrack({
      id: song.id,
      title: song.title,
      url: playUrl,
      artwork: song.thumbnailUrl,
      prompt: song.prompt,
      createdByUserName: song.user.name,
    });
    setIsLoading(false);
  };

  return (
    <div>
      <div onClick={handlePlay} className="cursor-pointer">
        <div className="group relative aspect-square w-full overflow-hidden rounded-md bg-gray-200group-hover:opacity-75">
          {
          song.thumbnailUrl ? 
            <img
              src={song.thumbnailUrl}
              alt={song.title}
              className="h-full w-full object-cover object-center"
            />
           : 
            <div className="bg-muted flex h-full w-full items-center justify-center ">
              <Music className="text-muted-foreground size-12"/>
            </div>
          
          }
        </div>
      </div>
    </div>
  );
}
