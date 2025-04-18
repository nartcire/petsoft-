"use client";

import { Button } from "@/components/ui/button";
import H1 from "@/components/h1";
import { createCheckoutSession } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTransition } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>Petsoft access requires payment</H1>

      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
        >
          Access Petsoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => await createCheckoutSession());
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}

      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again.
        </p>
      )}
    </main>
  );
}
