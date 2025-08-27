"use client";

import { useState } from "react";
import type { Track } from "~/app/(main)/create/track-list";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RenameModal({
  track,
  onClose,
  onRename,
}: {
  track: Track;
  onClose: () => void;
  onRename: (trackId: string, newTitle: string) => void;
}) {
  const [title, setTitle] = useState(track.title ?? "");

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onRename(track.id, title.trim());
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleRename}>
          <DialogHeader>
            <DialogTitle>Rename Song?</DialogTitle>
            <DialogDescription>Enter a new title and click Save Changes.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                className="col-span-3 rounded-md border"
                value={title}
                onChange={(e) => setTitle(e.target.value)}

              />
            </div>
          </div>
          <DialogFooter>
           <DialogClose asChild>
            <Button variant="outline" type="button" className="cursor-pointer">Cancel</Button>
           </DialogClose>
            <Button type="submit" className="cursor-pointer" variant="default">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
