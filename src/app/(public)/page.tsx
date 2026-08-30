"use client";

import HeroSection from "@/components/Home/HeroSection";
import TechniquesSection from "@/components/Home/TechniquesSection";
import FeaturedSection from "@/components/Home/FeaturedSection";
import TrustSection from "@/components/Home/TrustSection";

const Home = () => {
  return (
    <div className="font-display bg-white dark:bg-zinc-900 text-prussian-blue dark:text-white antialiased">
      <main className="flex-1">
        <HeroSection />
        <TechniquesSection />
        <FeaturedSection />
        <TrustSection />
      </main>
    </div>
  );
};

export default Home;
