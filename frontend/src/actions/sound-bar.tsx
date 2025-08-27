"use client";

import { Music } from "lucide-react";
import { Card } from "~/components/ui/card";
import { usePlayerStore } from "~/stores/e-player-stor";

export default function SoundBar() {
  const { track } = usePlayerStore();
  return (
    <div className="px-4 pb-2">
      <Card className="bg-background/60 relative w-full border-t py-0 backdrop-blur">
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-purple-800 via-violet-500 to-indigo-700">
                {track?.artwork ? (
                  <img
                    src={track.artwork}
                    alt="artwork"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <Music color="white" />
                )}
              </div>
              <div className="max-w-24 min-w-0 flex-1 md:max-w-full">
                <p className="truncate text-sm font-medium">
                  {track?.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{track?.createdByUserName}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
