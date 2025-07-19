import Hero from "@/components/landing/Hero";
import Section2 from "@/components/landing/Section2";
import Section7 from "@/components/landing/Section7";
import Section8 from "@/components/landing/Section8";
import Section9 from "@/components/landing/Section9";
import FeaturedProducts from "@/components/landing/featured-products";
import FeaturedServices from "@/components/landing/featured-services";
import RecommendedVendors from "@/components/landing/recommended-vendors";
import RecommendedArtisans from "@/components/landing/recommended-artisans";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Section2 />
      <RecommendedArtisans />
      <RecommendedVendors />
      <FeaturedServices />
      <FeaturedProducts />
      <Section7 />
      <Section8 />
      <Section9 />
    </div>
  );
}
