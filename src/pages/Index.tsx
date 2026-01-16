import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { DiscoverSection } from "@/components/sections/DiscoverSection";
import { FeaturedPropertiesSection } from "@/components/sections/FeaturedPropertiesSection";
import { DiningSection } from "@/components/sections/DiningSection";
import { NewOpeningsSection } from "@/components/sections/NewOpeningsSection";
import { HistorySection } from "@/components/sections/HistorySection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <DiscoverSection />
        <FeaturedPropertiesSection />
        <DiningSection />
        <NewOpeningsSection />
        <HistorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
