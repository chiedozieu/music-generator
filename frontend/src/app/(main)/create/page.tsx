
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SongPanel } from "~/components/create/song-panel";
import { auth } from "~/lib/auth";


export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return (
      redirect("/auth/sign-in")
    );
  }
  return (
    <div className="flex flex-col h-full lg:flex-row">
      <SongPanel />
    </div>
  );
}
