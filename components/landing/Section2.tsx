import React from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const Section2 = () => {
  const items = [
    "Quality Guaranteed",
    "Direct Access to Trusted Experts",
    "Seamless & Secure Transactions",
    "Fair Pricing & Transparent Deals",
    "Tailored Solutions for Every Need",
    "Ongoing Support & Assistance",
  ]

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row-reverse justify-center w-full items-center gap-12">
          <div className="w-full lg:w-1/3">
            <Image
              src="/assets/images/property.png?height=600&width=800"
              alt="Property"
              width={800}
              height={600}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#502266]">
              Get More with SphereServe
            </h2>
            <ul className="space-y-4">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-[#502266] flex-shrink-0 mt-1" />
                  <p className="text-lg md:text-xl text-[#502266]">{item}</p>
                </li>
              ))}
            </ul>
            <Button className="bg-[#502266] text-white hover:bg-[#502266]/90 text-lg px-14 py-6 rounded-xl">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section2