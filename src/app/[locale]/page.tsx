import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/public/TrustBar";
import Categories from "@/components/sections/Categories";
import WhyUs from "@/components/sections/WhyUs";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import dynamic from "next/dynamic";

const Sectors = dynamic(() => import("@/components/sections/Sectors"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const CTA = dynamic(() => import("@/components/sections/CTA"));

const ReferenceLogos = dynamic(() => import("@/components/ui/ReferenceLogos"));

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <WhyUs />
      <Stats />
      <About />
      <Sectors />
      <ReferenceLogos variant="compact" className="py-12 lg:py-16" />
      <Testimonials />
      <CTA />
    </>
  );
}
