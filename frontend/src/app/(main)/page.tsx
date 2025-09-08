import { Music } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPresignedUrl } from "~/actions/generation";
import { SongCard } from "~/components/home/song-card";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/sign-in");
  }
const baseQuery = {
  where: {
    published: true,
  },
  include: {
    user: {
      select: {
        name: true,
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
    categories: true,
  },
  orderBy: {
    createdAt: "desc" as const,
  },
  take: 100,
};

const song = await db.song.findMany({
  ...baseQuery,
  include: {
    ...baseQuery.include,
    ...(session.user.id && {
      likes: {
        where: {
          userId: session.user.id
        }
      }
    })
  }
});

  const songsWithUrls = await Promise.all(
    song.map(async (song) => {
      const thumbnailUrl = song.thumbnails3Key
        ? await getPresignedUrl(song.thumbnails3Key)
        : null;
      return {
        ...song,
        thumbnailUrl,
      };
    }),
  );
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const trendingSongs = songsWithUrls
    .filter((song) => song.createdAt >= twoDaysAgo)
    .slice(0, 10);

  const trendingSongsIds = new Set(trendingSongs.map((song) => song.id));

  const categorizedSongs = songsWithUrls
    .filter(
      (song) => !trendingSongsIds.has(song.id) && song.categories.length > 0,
    )
    .reduce(
      (acc, song) => {
        const primaryCategory = song.categories[0];
        if (primaryCategory) {
          acc[primaryCategory.name] ??= [];
          if (acc[primaryCategory.name]!.length < 10) {
            acc[primaryCategory.name]!.push(song);
          }
        }
        return acc;
      },
      {} as Record<string, Array<(typeof songsWithUrls)[number]>>,
    );

  if (
    trendingSongs.length === 0 &&
    Object.keys(categorizedSongs).length === 0
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <Music className="text-muted-foreground size-20" />
        <h1 className="tracking-light mt-4 text-2xl font-bold text-gray-800">
          No Music Here
        </h1>
        <p className="text-muted-foreground mt-2">
          There are no songs available at the moment. Please check back later.
        </p>
      </div>
    );
  }
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-800">
        Discover Music
      </h1>
      {/* trending songs */}
      {trendingSongs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800">Trending</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}
      {/* categorized songs */}
      {Object.entries(categorizedSongs)
        .slice(0, 5)
        .map(([category, songs]) => (
          <div key={category} className="mt-6">
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
