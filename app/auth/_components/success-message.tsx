import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsFillPatchCheckFill } from "react-icons/bs";

export function SuccessMessage() {
  return (
    <div className="max-w-md w-full space-y-6 text-center">
      <BsFillPatchCheckFill className="size-32 text-primary mx-auto" />
      <div>
        <h1 className="text-4xl font-bold text-primary">
          You&apos;re all set!
        </h1>
        <p className="text-md text-gray-400 mt-2">
          Your password has been reset successfully
        </p>
      </div>
      <Button asChild className="w-full h-12">
        <Link href="/auth/login">Continue</Link>
      </Button>
    </div>
  );
}
