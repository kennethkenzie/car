import { Header } from "@/components/Header";
import { SearchHero } from "@/components/SearchHero";
import TrustBar from "@/components/TrustBar";
import DynamicCategorySection from "@/components/DynamicCategorySection";
import CategoryTilesSection from "@/components/CategoryTilesSection";
import LatestProductsSection from "@/components/LatestProductsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <SearchHero />
      <TrustBar />
      <DynamicCategorySection />
      <CategoryTilesSection />
      <LatestProductsSection />
    </main>
  );
}
