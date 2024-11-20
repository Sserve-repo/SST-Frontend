"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { FC } from "react";
import React, { useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface ImageShowCaseProps {
  shots: string[];
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Handle Next Image
  const handleNext = () => {
    if (shots.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % shots.length);
    }
  };

  // Handle Previous Image
  const handlePrev = () => {
    if (shots.length > 0) {
      setActiveImageIndex((prev) => (prev === 0 ? shots.length - 1 : prev - 1));
    }
  };

  // Return null or a fallback UI if shots array is empty
  if (!shots || shots.length === 0) {
    return <p>No images available</p>; // You can customize this message as needed
  }

  return (
    <div className="space-y-3 rounded-2xl sm:p-2">
      {/* Main Image with Framer Motion slide and fade animations */}
      <div className="relative overflow-hidden rounded-2xl h-[400px] md:h-[500px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeImageIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={shots[activeImageIndex]}
              alt="product image"
              className="h-full w-full object-cover object-top bg-gray-200"
              width={1000}
              height={1000}
            />
          </motion.div>
        </AnimatePresence>
        {/* Carousel Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            className="bg-white shadow bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 text-black aspect-square"
            onClick={handlePrev}
          >
            <IoIosArrowBack />
          </button>
          <button
            className="bg-white shadow bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 text-black aspect-square"
            onClick={handleNext}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex gap-3 flex-wrap overflow-y-auto">
        {shots.map((shot, index) => (
          <div
            key={shot}
            className={`${
              activeImageIndex === index ? "border-4 border-primary" : ""
            } h-[80px] aspect-square overflow-hidden rounded-lg`}
          >
            <button
              className="h-full w-full"
              type="button"
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={shot}
                alt="thumbnail image"
                className="h-full w-full object-cover object-top bg-gray-200"
                width={500}
                height={500}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageShowCase;
