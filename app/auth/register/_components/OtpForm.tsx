import React, { useState, useRef } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type OtpFormProps = {
  form: any;
  setOtp: (otp: string) => void;
};

export function OtpForm({ form, setOtp }: OtpFormProps) {
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    if (/^\d?$/.test(value)) {
      const newCodeDigits = [...codeDigits];
      newCodeDigits[index] = value;
      setCodeDigits(newCodeDigits);

      if (value && index < codeDigits.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      setOtp(
        newCodeDigits
          .filter((digit) => digit !== "")
          .join(",")
          .replaceAll(",", "")
      );
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && codeDigits[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, codeDigits.length);
    const newCodeDigits = [...codeDigits];

    pastedData.split("").forEach((char, index) => {
      if (index < newCodeDigits.length) {
        newCodeDigits[index] = char;
      }
    });

    setCodeDigits(newCodeDigits);
    setOtp(newCodeDigits.join(",")); // Update OTP immediately after pasting
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  return (
    <div className="grid grid-cols-1 text-center gap-y-8 justify-center items-center max-w-[515px] py-[72px] mx-auto w-full relative">
      <div>
        <h1 className="text-2xl text-[#502266] font-bold">Enter OTP</h1>

        <p className="text-lg font-normal text-[#b9b9b9] mb-[10px] pr-[20px]">
          An OTP has been sent to your email. Confirm OTP to continue your
          account setup.
        </p>
      </div>
      <FormField
        control={form.control}
        name={"otp"}
        render={() => (
          <FormItem className="w-full">
            <FormLabel className="text-gray-400 mb-2"></FormLabel>
            <FormControl>
              <div className="flex justify-center gap-2">
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    min="0"
                    max="9"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className="w-[3em] h-[3.3em] bg-[#E9E9E9] text-[#502266] text-xl font-bold appearance-none text-center input-no-spinner border rounded-lg mx-2"
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
