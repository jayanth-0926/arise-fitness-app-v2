import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TrainingCategories from "@/components/TrainingCategories";
import MotivationSection from "@/components/MotivationSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrainingCategories />
        <MotivationSection />
      </main>
      <Footer />
    </>
  );
}
