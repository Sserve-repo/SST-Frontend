import Hero from "@/components/landing/Hero";
import Section2 from "@/components/landing/Section2";
import Section3 from "@/components/landing/Section3";
import Section4 from "@/components/landing/Section4";
import Section5 from "@/components/landing/Section5";
import Section6 from "@/components/landing/Section6";
import Section7 from "@/components/landing/Section8";
import Section9 from "@/components/landing/Section9";
// import Section8 from "@/components/landing/Section9";

export default function Home() {
  return (
    <div className=" w-full">
      <Hero />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      {/* <Section8 /> */}
      <Section9 />
      <Section7 />
    </div>
  );
}
