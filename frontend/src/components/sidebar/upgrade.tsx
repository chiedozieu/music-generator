"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "86347b8f-72d4-4eec-8b80-0f680e2ff5e4",
        "d55c241b-9afd-474c-b487-e9128468b540",
        "04d3b470-07d2-4ef2-962d-1f2995eebc2b",
      ],
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 cursor-pointer text-orange-400"
      onClick={upgrade}
    >
      Upgrade
    </Button>
  );
}

