import { AccountView } from "@daveyplate/better-auth-ui";
import { accountViewPaths } from "@daveyplate/better-auth-ui/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container p-4 md:p-6">
      <Link
        href="/"
        className="group mb-4 flex cursor-pointer items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeft
          size={14}
          className="transition-all duration-200 group-hover:-translate-x-1"
        />
        Back
      </Link>

      <AccountView path={path} />
    </main>
  );
}
