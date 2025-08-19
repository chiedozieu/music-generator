import { db } from "~/server/db";
import { inngest } from "./client";
import { env } from "~/env";

export const generateSong = inngest.createFunction(
  { id: "generate-song" },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    const { songId } = event.data as {
      songId: string;
      userId: string;
    };
    const { userId, credits, endpoint, body } = await step.run("check-credits", async () => {
      const song = await db.song.findUniqueOrThrow({
        where: {
          id: songId,
        },
        select: {
          user: {
            select: {
              id: true,
              credits: true,
            },
          },
          prompt: true,
          lyrics: true,
          fullDescribedSong: true,
          describedLyrics: true,
          instrumental: true,
          guidanceScale: true,
          inferStep: true,
          audioDuration: true,
          seed: true,
        },
      });
      type RequestBody = {
        guidance_scale?: number;
        infer_step?: number;
        audio_duration?: number;
        seed?: number;
        full_described_song?: string;
        prompt?: string;
        lyrics?: string;
        described_lyrics?: string;
        instrumental?: boolean;
      };

      let endpoint = "";

      let body: RequestBody = {};

      const commonParams = {
        guidance_scale: song.guidanceScale ?? undefined,
        infer_step: song.inferStep ?? undefined,
        audio_duration: song.audioDuration ?? undefined,
        seed: song.seed ?? undefined,
        instrumental: song.instrumental ?? undefined,
      };

      // Description of a song
      if (song.fullDescribedSong) {
        endpoint = env.GENERATE_FROM_DESCRIPTION;
        body = {
          full_described_song: song.fullDescribedSong,
          ...commonParams,
        };
      }

      // custom mode lyrics + prompt
      else if (song.lyrics && song.prompt) {
        endpoint = env.GENERATE_FROM_DESCRIBED_LYRICS;
        body = {
          lyrics: song.lyrics,
          prompt: song.prompt,
          ...commonParams,
        };
      }
      // custom mode prompt + described lyrics
      else if (song.describedLyrics && song.prompt) {
        endpoint = env.GENERATE_FROM_DESCRIBED_LYRICS;
        body = {
          described_lyrics: song.describedLyrics,
          prompt: song.prompt,
          ...commonParams,
        };
      }

      return {
        userId: song.user.id,
        credits: song.user.credits,
        endpoint: endpoint,
        body: body,
      };
    });
  },
);
