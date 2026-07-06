import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { CourseSection } from "@/components/course-section";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full min-h-screen">
      <Navbar />
      <CinematicHero />
      <CourseSection />
      <footer className="border-t border-white/10 px-5 py-10 text-center text-xs text-muted-foreground">
        Disclaimer: Trading in XAUUSD / Forex involves substantial risk. This course is for
        educational purposes only and does not guarantee profits.
      </footer>
    </main>
  );
}
