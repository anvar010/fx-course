import { PricingSection, type PricingPlan } from "@/components/ui/pricing";
import { COURSES } from "@/lib/courses";
import { Testimonials } from "@/components/ui/testimonials-demo";

const plans: PricingPlan[] = [
  {
    name: COURSES.recorded.name,
    price: String(COURSES.recorded.amount),
    period: "one-time",
    priceNote: COURSES.recorded.priceNote,
    description: COURSES.recorded.sub,
    features: [
      "Full recorded course — lifetime access",
      "Watch anytime on mobile or desktop",
      "Downloadable notes & checklists",
    ],
    buttonText: "Enroll Now",
    href: "/enroll/recorded",
  },
  {
    name: COURSES.live.name,
    price: String(COURSES.live.amount),
    period: "one-time",
    priceNote: COURSES.live.priceNote,
    description: COURSES.live.sub,
    features: [
      "Live interactive Zoom sessions",
      "Live market analysis & trade execution",
      "Certificate + private community access",
    ],
    buttonText: "Enroll Now",
    href: "/enroll/live",
    isPopular: true,
  },
  {
    name: "TradingView EA's",
    period: "to be announced",
    priceNote: "Launching soon",
    description: "Expert advisors & indicators for hands-free trading",
    features: [
      "Automated XAUUSD trading strategies",
      "TradingView indicators & alerts",
      "Priority access for enrolled students",
    ],
    buttonText: "Coming Soon",
    comingSoon: true,
  },
];

export function CourseSection() {
  return (
    <section id="courses">
      <PricingSection
        plans={plans}
        title="Enroll in the XAUUSD Course"
        description="Learn to trade gold with a proven strategy — pick the format that suits your schedule."
      />
      <Testimonials />
    </section>
  );
}
