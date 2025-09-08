"use client";

import {
  Download,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Slider } from "~/components/ui/slider";
import { usePlayerStore } from "~/stores/e-player-store";

export default function SoundBar() {
  const { track } = usePlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [currentSongTime, setCurrentSongTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if(!audio) return;
    const updateTime = () => setCurrentSongTime(audio.currentTime);
    const updateDuration = () => {
      if(!isNaN(audio.duration))
      setDuration(audio.duration)
    };
    const handleTrackEnd = () => {
      setIsPlaying(false);
      setCurrentSongTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleTrackEnd);
  
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleTrackEnd);
    };
    
  }, [track]);

  useEffect(() => {
    if (audioRef.current && track?.url) {
      setCurrentSongTime(0);
      setDuration(0);

      audioRef.current.src = track.url;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0]! / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
       await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && value[0] !== undefined) {
      audioRef.current.currentTime = value[0];
      setCurrentSongTime(value[0]);
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (!track) {
    return null;
  }
  
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
                  <Music color="white" className="size-4" />
                )}
              </div>
              <div className="max-w-24 min-w-0 flex-1 md:max-w-full">
                <p className="truncate text-sm font-medium">{track?.title}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {track?.createdByUserName}
                </p>
              </div>
            </div>
            {/* center controls */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Button
                size="icon"
                className="cursor-pointer rounded-full bg-gradient-to-r from-purple-800 via-violet-500 to-indigo-700 hover:opacity-80"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="cup size-4" />
                )}
              </Button>
            </div>

            {/* additional controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  step={1}
                  className="w-16"
                  max={100}
                  min={0}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      if (!track?.url) return;
                      window.open(track.url, "_blank");
                    }}
                  >
                    <Download className="mr-2 size-4" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* song progress bar*/}

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground w-8 text-right text-[10px]">
              {formatTime(currentSongTime)}
            </span>
            <Slider
              className="flex-1"
              value={[currentSongTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
            <span className="text-muted-foreground w-8 text-left text-[10px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {track?.url && (
          <audio
            ref={audioRef}
            src={track.url}
            preload="metadata"
          />
        )}
      </Card>
    </div>
  );
}
