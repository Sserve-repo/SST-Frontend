"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for form validation
const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full Name must be at least 2 characters" })
    .max(50, { message: "Full Name can't exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(100, { message: "Subject can't exceed 100 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message can't exceed 1000 characters" }),
});

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      <Image
        className="absolute inset-0 object-cover w-full h-full"
        src="/assets/images/contactus.png"
        alt="Contact us background"
        width={1920}
        height={1080}
        priority
      />

      <div className="relative z-10 container mx-auto xs:px-4 px-2 py-28 md:py-32 lg:py-36">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12">
            Contact Us
          </h1>

          <div className="bg-white rounded-2xl max-w-lg shadow-xl p-6 md:p-8">
            <p className="text-base md:text-md text-primary font-semibold mb-6">
              We&apos;d love to hear from you. Please fill out this form.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="fullName">
                  Full Name (First Name, Last Name)
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  className="mt-1"
                  {...register("fullName")}
                />
                {errors.fullName?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="mt-1"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter the subject of your message"
                  className="mt-1"
                  {...register("subject")}
                />
                {errors.subject?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here"
                  className="mt-1"
                  rows={4}
                  {...register("message")}
                />
                {errors.message?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
