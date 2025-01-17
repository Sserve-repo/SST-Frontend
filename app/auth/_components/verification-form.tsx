"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/constant";

export function VerificationForm() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Access localStorage only after component mounts
    const storedEmail = localStorage.getItem("user_email");
    setEmail(storedEmail);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (code[index] === "") {
        if (index > 0) {
          const prevInput = document.getElementById(`code-${index - 1}`);
          prevInput?.focus();
        }
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData("text");
    if (/^\d{6}$/.test(pasteData)) {
      const newCode = pasteData.split("");
      setCode(newCode);
      const lastInput = document.getElementById(`code-${5}`);
      lastInput?.focus();
    } else {
      toast.error("Invalid OTP format. Please paste a valid 6-digit code.");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please try again");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const result = await response.json();

      if (response.ok && result.status) {
        toast.success("Verification code resent");
      } else {
        toast.error(result.message || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      toast.error("Failed to resend code");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please try again");
      return;
    }

    const otp = code.join("");
    if (otp.length < 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/auth/passwordOtpVerification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: email, otp }),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        toast.success(result.message);
        router.push(`/auth/reset-password`);
      } else {
        toast.error(result.message || "Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying the code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-primary">Verification</h1>
        <p className="text-md text-gray-400 mt-2">
          Enter the 6-digit code that you received in your email.
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
              className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-md"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
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
