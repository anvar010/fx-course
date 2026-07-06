/* ============================================================
   CONFIG — ⚠️ EDIT THESE BEFORE GOING LIVE
   ============================================================ */
export const CONFIG = {
  upiId: "yourname@upi", // ← your UPI ID (e.g. nikki@okhdfcbank)
  payeeName: "nikki.fx", // ← name shown in the UPI app
  whatsapp: "919999999999", // ← WhatsApp number with country code, digits only
};

export type CourseKey = "live" | "recorded";

export type Lesson = {
  title: string;
  detail: string;
  /** Optional embed URL (e.g. YouTube embed link) — when set, the lesson page shows the video player */
  videoUrl?: string;
};

export type Course = {
  type: string;
  name: string;
  sub: string;
  amount: number;
  priceNote: string;
  points: string[];
  desc: string;
  syllabus: Lesson[];
  featured?: boolean;
};

export const COURSES: Record<CourseKey, Course> = {
  live: {
    type: "🔴 Live Class",
    name: "Live Mentorship Batch",
    sub: "Interactive live sessions with the mentor",
    amount: 7000,
    priceNote: "Limited seats per batch",
    featured: true,
    points: [
      "Live interactive Zoom sessions",
      "Complete XAUUSD strategy from basics to advanced",
      "Live market analysis & trade execution",
      "Ask questions & get doubts cleared instantly",
      "Risk management & trading psychology",
      "Private community group access",
      "Session recordings for revision",
      "Certificate of completion",
    ],
    desc: "An interactive live program where you learn directly from the mentor over Zoom. You will watch real-time market analysis on XAUUSD, execute trades along with the mentor, and get every doubt cleared instantly. Seats are limited per batch so every student gets personal attention.",
    syllabus: [
      { title: "Module 1", detail: "Forex & gold market basics — sessions, spreads, lot size, leverage" },
      { title: "Module 2", detail: "Market structure — trends, support/resistance, supply & demand zones" },
      { title: "Module 3", detail: "Smart money concepts — liquidity, order blocks, fair value gaps" },
      { title: "Module 4", detail: "The complete XAUUSD strategy — entry, stop loss & target rules" },
      { title: "Module 5", detail: "Risk management — position sizing, drawdown control, R:R" },
      { title: "Module 6", detail: "Trading psychology — discipline, patience, handling losses" },
      { title: "Live practice", detail: "Real-time market analysis & trade execution sessions" },
      { title: "Bonus", detail: "Private community + session recordings + certificate" },
    ],
  },
  recorded: {
    type: "🎥 Recorded Class",
    name: "Recorded Class",
    sub: "Learn anytime, at your own speed",
    amount: 5000,
    priceNote: "Instant access after payment",
    points: [
      "Full recorded video course (lifetime access)",
      "Same complete XAUUSD strategy content",
      "Watch anytime on mobile or desktop",
      "Chart examples & real trade breakdowns",
      "Risk management & trading psychology",
      "Downloadable notes & checklists",
      "Free future content updates",
    ],
    desc: "The complete XAUUSD strategy in structured recorded videos with lifetime access. Learn at your own pace on any device, rewatch lessons whenever you want, and follow along with real chart examples and trade breakdowns. Perfect if you have a busy schedule.",
    syllabus: [
      { title: "Module 1", detail: "Forex & gold market basics — sessions, spreads, lot size, leverage" },
      { title: "Module 2", detail: "Market structure — trends, support/resistance, supply & demand zones" },
      { title: "Module 3", detail: "Smart money concepts — liquidity, order blocks, fair value gaps" },
      { title: "Module 4", detail: "The complete XAUUSD strategy — entry, stop loss & target rules" },
      { title: "Module 5", detail: "Risk management — position sizing, drawdown control, R:R" },
      { title: "Module 6", detail: "Trading psychology — discipline, patience, handling losses" },
      { title: "Extras", detail: "Real trade breakdowns, downloadable notes & checklists" },
      { title: "Bonus", detail: "Lifetime access + free future updates" },
    ],
  },
};

// Demo video shown on every lesson until the real course videos are ready.
// To give a lesson its own video, set videoUrl directly on that syllabus entry above.
const DEMO_VIDEO_URL = "https://www.youtube.com/embed/5wkJBth0C0E";
for (const course of Object.values(COURSES)) {
  for (const lesson of course.syllabus) {
    lesson.videoUrl ??= DEMO_VIDEO_URL;
  }
}

export function upiLink(course: CourseKey) {
  const c = COURSES[course];
  const params = new URLSearchParams({
    pa: CONFIG.upiId,
    pn: CONFIG.payeeName,
    am: String(c.amount),
    cu: "INR",
    tn: `XAUUSD Course - ${course === "live" ? "Live" : "Recorded"}`,
  });
  return `upi://pay?${params.toString()}`;
}

export function whatsappLink(course: CourseKey) {
  const c = COURSES[course];
  const msg = `Hi! I have paid ₹${c.amount} for the ${c.name} (XAUUSD course). Here is my payment screenshot.`;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}
