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
import { ChevronLeft, ChevronRight } from "lucide-react";

const Section8 = () => {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleCard = (cardId: string) => {
    setOpenCard(openCard === cardId ? null : cardId);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
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

  const testimonials = [
    {
      name: "Hannah Schmitt",
      title: "CEO, Julie Cuisine",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris nec turpis orci lectus maecenas.",
      imageUrl: "/assets/images/passport.png",
    },
    {
      name: "John Doe",
      title: "Manager, XYZ Corp",
      feedback:
        "Suspendisse sed magna eget nibh in turpis. Consequat dui diam lacus arcu. Faucibus venenatis felis id.",
      imageUrl: "/assets/images/person.png",
    },
    {
      name: "Jane Smith",
      title: "Founder, ABC Inc",
      feedback:
        "Faubus venenatis felis id augue sit cursus pellentesque enim. Lorem ipsum dolor sit amet.",
      imageUrl: "/assets/images/passport.png",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-24 ">
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
                        className={`ml-auto rounded-xl aspect-square ${
                          openCard === item.id ? "bg-[#FF7F00]" : "bg-black"
                        } text-white`}
                      >
                        {openCard === item.id ? (
                          <Minus className="h-4 w-4 aspect-square" />
                        ) : (
                          <Plus className="h-4 w-4 aspect-square" />
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
          <h2 className="sm:text-3xl text-2xl md:text-4xl text-[#240F2E] font-bold mb-12 sm:mb-24">
            What Our Clients Say About Us
          </h2>

          <div className="relative max-w-3xl mx-auto">
            <Image
              className="absolute hidden md:block -top-10 right-10 object-cover bg-center"
              src="/assets/images/vector.png"
              alt="background"
              width={520}
              height={580}
            />

            <div className="relative h-[24rem] sm:h-[28rem] w-full">
              {testimonials.map((testimonial, index) => {
                const isActive = index === activeIndex;
                const isPrev =
                  index ===
                  (activeIndex - 1 + testimonials.length) % testimonials.length;
                const isNext =
                  index === (activeIndex + 1) % testimonials.length;

                return (
                  <div
                    key={index}
                    className={`absolute top-8 left-0 right-0 w-11/12 sm:w-9/12 mx-auto h-80 bg-white shadow-2xl rounded-lg transition-all duration-700 ease-in-out 
                    ${
                      isActive
                        ? "z-30 translate-x-0 scale-100 opacity-100"
                        : isNext
                        ? "z-20 translate-x-[5%] scale-95 opacity-90"
                        : isPrev
                        ? "z-10 -translate-x-[5%] scale-95 opacity-90"
                        : "opacity-0"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full w-full p-6 sm:px-10 text-center">
                      <div className="mb-6 w-full">
                        <Image
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          width={90}
                          height={90}
                          className={`rounded-full mx-auto  aspect-square object-cover bg-cover ${
                            isActive
                              ? "absolute top-0 left-0 right-0 sm:right-3 transform -translate-x-1/6 -translate-y-1/2"
                              : " "
                          }`}
                        />
                        <h3 className="text-lg font-semibold mt-2">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                      <p className="text-gray-600 italic">
                        &quot;{testimonial.feedback}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              size="icon"
              variant="outline"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full z-40"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full z-40"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next testimonial</span>
            </Button>

            {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mb-4">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeIndex ? "bg-[#FF7F00]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section8;
