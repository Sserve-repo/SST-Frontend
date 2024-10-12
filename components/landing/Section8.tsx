"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const Section8 = () => {
  const [openCard, setOpenCard] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setOpenCard(openCard === cardId ? null : cardId);
  };

  const cards = [
    {
      id: "1",
      title: "Why is SphereServe the best?",
      description:
        "SphereServe connects you to verified artisans and vendors, ensuring quality service delivery. With our user-friendly platform, finding the perfect professional has never been easier!",
    },
    {
      id: "2",
      title: "How to join as an artisan?",
      description:
        "To join SphereServe as an artisan, sign up, complete your profile, and get verified. You'll then be able to showcase your skills and connect with clients in your local area.",
    },
    {
      id: "3",
      title: "When was SphereServe Inc founded?",
      description:
        "SphereServe Inc was founded in 2023 with the mission of creating a reliable platform that empowers local artisans and vendors by connecting them to customers.",
    },
    {
      id: "4",
      title: "Who founded SphereServe Inc?",
      description:
        "SphereServe Inc was founded by a team of seasoned entrepreneurs with experience in technology, marketing, and customer service. Their goal is to make local services more accessible.",
    },
    {
      id: "5",
      title: "Is SphereServe the future of work?",
      description:
        "SphereServe embraces the gig economy, offering flexible opportunities for artisans and vendors to grow their businesses, making it the future of localized work.",
    },
    {
      id: "6",
      title: "Who are the founders?",
      description:
        "The founders of SphereServe are industry experts with a vision to bridge the gap between service providers and clients, ensuring everyone has access to quality local services.",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-[#F7F0FA] rounded-3xl p-6 md:p-12">
          <h2 className="text-center text-[#502266] text-3xl md:text-4xl font-bold mb-12">
            What is SphereServe?
          </h2>

          <Accordion
            type="single"
            collapsible
            className="grid md:grid-cols-2 gap-6"
          >
            {cards.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <Card className="rounded-2xl shadow-none border-none">
                  <CardContent className="px-6 py-1">
                    <AccordionTrigger
                      onClick={() => toggleCard(item.id)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-bold text-left">{item.title}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className={`ml-auto rounded-xl ${
                          openCard === item.id ? "bg-[#FF7F00]" : "bg-black"
                        } text-white`}
                      >
                        {openCard === item.id ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mt-4">{item.description}</p>
                    </AccordionContent>
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Client Testimonials Section */}
        <div className="mt-24 md:mt-40 text-center">
          <h2 className="text-3xl md:text-4xl text-[#240F2E] font-bold mb-12">
            What Our Clients Say About Us
          </h2>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Decorative background"
              width={800}
              height={400}
              className="mx-auto"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
              <div className="relative flex justify-center items-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 w-11/12 h-64 bg-white shadow-2xl"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 w-10/12 h-72 bg-white shadow-2xl"></div>
                <div className="w-9/12 h-80 mx-auto bg-white shadow-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section8;
