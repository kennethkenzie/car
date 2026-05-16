import { Header } from "@/components/Header";
import { SearchHero } from "@/components/SearchHero";
import { Footer } from "@/components/Footer";
import LatestProductsSection from "@/components/LatestProductsSection";
import DynamicCategorySection from "@/components/DynamicCategorySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <SearchHero />
      <DynamicCategorySection />
      <LatestProductsSection />
      <Footer />
    </main>
  );
}
