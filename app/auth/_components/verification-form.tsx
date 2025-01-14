"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function VerificationForm() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const router = useRouter();

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResend = async () => {
    try {
      // TODO: Implement resend logic
      toast.success("Verification code resent");
    } catch (error) {
      console.log({ error });
      toast.error("Failed to resend code");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Implement verification logic
      toast.success("Verification successful");
      router.push("/auth/reset-password");
    } catch (error) {
      console.log({ error });
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-primary">Verification</h1>
        <p className="text-md text-gray-400 mt-2">
          Enter your 4 digits code that you received on your email.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex gap-4 justify-center">
          {code.map((digit, index) => (
            <Input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              className="w-16 h-16 text-2xl text-center"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
        </div>
        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
        </Button>
      </form>
      <div className="text-center">
        <p className="text-gray-500">
          If you didn&apos;t receive a code!{" "}
          <Button
            variant="link"
            className="text-primary p-0"
            onClick={handleResend}
          >
            Resend
          </Button>
        </p>
      </div>
    </div>
  );
}
