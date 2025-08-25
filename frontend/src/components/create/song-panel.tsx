"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";

const inspirationTags = [
  "Afro-Gospel",
  "Pop-Punk",
  "Gospel Rap",
  "Amapiano",
  "Lo-fi hip hop",
  "Urban Gospel",
];

const styleTags = [
  "Atmospheric synths",
  "Trap beats",
  "vibrant percussion",
  "glitchy effects",
  "Jazzy chords",
  "global fusion",
  "chillwave",
  "synthwave",
  "lo-fi beats",
];

export function SongPanel() {
  const [mode, setMode] = useState<"simple" | "custom">("simple");
  const [description, setDescription] = useState<string>("");
  const [instrumental, setInstrumental] = useState<boolean>(false);
  const [lyricsMode, setLyricsMode] = useState<"write" | "auto">("write");
  const [lyrics, setLyrics] = useState<string>("");
  const [styleInput, setStyleInput] = useState<string>("");

  const handleInspirationTagClick = (tag: string) => {
    const currentTags = description
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (!currentTags.includes(tag)) {
      if (description.trim() === "") {
        setDescription(tag);
      } else {
        setDescription(`${description}, ${tag}`);
      }
    }
  };
  const handleStyleInputTagClick = (tag: string) => {
    const currentTags = styleInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (!currentTags.includes(tag)) {
      if (styleInput.trim() === "") {
        setStyleInput(tag);
      } else {
        setStyleInput(`${styleInput}, ${tag}`);
      }
    }
  };
  return (
    <div className="bg-muted/30 flex w-full flex-col border-r lg:w-80">
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "simple" | "custom")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="simple" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-600">
                Describe your song
              </label>
              <Textarea
                placeholder="A vibrant mix of blues and funk perfect for any occasion"
                className="min-h-[120px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* lyrics button and instrumental toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer border-blue-200 text-gray-600"
                onClick={() => {
                  setMode("custom");
                }}
              >
                <Plus className="mr-2" />
                Lyrics
              </Button>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Instrumental
                </label>
                <Switch
                  checked={instrumental}
                  onCheckedChange={setInstrumental}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-600">
                Inspiration
              </label>
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="mx-auto flex gap-2 pb-2">
                  {inspirationTags.map((tag) => (
                    <Button
                      key={tag}
                      className="h-7 cursor-pointer border-blue-200 text-gray-600"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInspirationTagClick(tag)}
                    >
                      <Plus className="mr-1 flex-shrink-0 bg-transparent text-xs" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="custom" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600">
                  Lyrics
                </label>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    className="h-7 border-blue-200 text-xs text-gray-600"
                    onClick={() => {
                      setLyricsMode("auto");
                      setLyrics("");
                    }}
                    variant={lyricsMode === "auto" ? "outline" : "ghost"}
                  >
                    Auto
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 border-blue-200 text-xs text-gray-600"
                    onClick={() => {
                      setLyricsMode("write");
                      setLyrics("");
                    }}
                    variant={lyricsMode === "write" ? "outline" : "ghost"}
                  >
                    Write
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder={
                  lyricsMode === "write"
                    ? "Write your own lyrics here"
                    : "Describe your lyrics, e.g a song about love, joy, and hope"
                }
                className="min-h-[120px] resize-none"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">
                Instrumental
              </label>
              <Switch
                checked={instrumental}
                onCheckedChange={setInstrumental}
              />
            </div>
            {/* styles */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">
                Styles
              </label>
              <Textarea
                placeholder="Enter style tags"
                className="min-h-[60px] resize-none mt-4"
                value={styleInput}
                onChange={(e) => setStyleInput(e.target.value)}
              />
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 py-2">
                  {styleTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="hover:bg-secondary/80 flex-shrink-0 cursor-pointer text-xs"
                      onClick={() => handleStyleInputTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
