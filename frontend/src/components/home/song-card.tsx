"use client";

import type { Category, Like, Song } from "@prisma/client";
import { Heart, Loader2, Music, Play } from "lucide-react";
import { useState } from "react";
import { getPlayUrl } from "~/actions/generation";
import { toggleLikeSong } from "~/actions/song";
import { usePlayerStore } from "~/stores/e-player-store";

type SongWithRelation = Song & {
  user: { name: string | null };
  _count: { likes: number };
  categories: Category[];
  thumbnailUrl?: string | null;
  likes?: Like[]; 
};
export function SongCard({ song }: { song: SongWithRelation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ isLiked, setIsLiked ] = useState(song.likes ? song.likes.length > 0 : false);
  const [ likesCount, setLikesCount ] = useState(song._count.likes);

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

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    await toggleLikeSong(song.id);
  };

  return (
    <div>
      <div onClick={handlePlay} className="cursor-pointer">
        <div className="group relative aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
          {song.thumbnailUrl ? (
            <img
              src={song.thumbnailUrl}
              alt={song.title}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Music className="text-muted-foreground size-12" />
            </div>
          )}
          {/* loader */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 ">
              {isLoading ? (
                <Loader2 className="size-6 animate-spin text-white" />
              ) : (
                <Play className="size-6 fill-accent hover:scale-110 transition-all duration-300" />
              )}
            </div>
          </div>
        </div>
        {/* title */}
    
          <h3 className="mt-2 test-xs font-bold text-gray-700 truncate">{song.title}</h3>
          <p className="text-xs text-gray-500 truncate">{song.user.name}</p>
      </div>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-800">
            <span className="">{song.listenCount} listens</span>
            <button onClick={handleLike} className="flex cursor-pointer items-center gap-1  duration-300">
                <Heart className={`hover:text-red-500 transition-colors size-4 ${isLiked ? "text-red-500 fill-red-500" : ""}`}/>
                {likesCount} likes
            </button>
        </div>
    </div>
  );
}
