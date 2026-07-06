"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft } from "lucide-react";
import { OrderConfirmationCard } from "@/components/ui/order-confirmation-card";
import { Navbar } from "@/components/navbar";
import { addEnrollment } from "@/lib/enrollments";
import { CONFIG, COURSES, upiLink, whatsappLink, type CourseKey } from "@/lib/courses";

export function EnrollView({ courseKey }: { courseKey: CourseKey }) {
  const course = COURSES[courseKey];
  const [confirmation, setConfirmation] = useState<{ orderId: string; dateTime: string } | null>(
    null
  );

  const confirmPayment = () => {
    const orderId = `XAU-${Date.now().toString().slice(-8)}`;
    const dateTime = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    addEnrollment({
      courseKey,
      courseName: course.name,
      amount: course.amount,
      orderId,
      dateTime,
    });
    setConfirmation({ orderId, dateTime });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-24">
        <Link
          href="/#courses"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>

        {confirmation ? (
          /* ---------- Success state ---------- */
          <div className="flex flex-col items-center py-10">
            <OrderConfirmationCard
              orderId={confirmation.orderId}
              paymentMethod="UPI"
              dateTime={confirmation.dateTime}
              totalAmount={`₹${course.amount.toLocaleString("en-IN")}`}
              title="Your enrollment has been successfully submitted"
              buttonText="Send Payment Screenshot on WhatsApp"
              onGoToAccount={() => window.open(whatsappLink(courseKey), "_blank", "noopener")}
            />
            <Link
              href="/"
              className="mt-6 text-sm font-medium text-muted-foreground hover:text-gold"
            >
              Back to home
            </Link>
          </div>
        ) : (
          /* ---------- Course details + payment ---------- */
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            {/* Left: explanation */}
            <div>
              <div className="text-gold text-xs font-bold uppercase tracking-[0.15em]">
                {course.type}
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
                {course.name}
              </h1>
              <p className="mt-1 text-muted-foreground">{course.sub}</p>

              <div className="mt-5 text-4xl font-extrabold text-gold-light">
                ₹{course.amount.toLocaleString("en-IN")}{" "}
                <span className="text-base font-medium text-muted-foreground">one-time</span>
              </div>
              <p className="text-xs text-muted-foreground">{course.priceNote}</p>

              <p className="mt-6 text-[15px] leading-relaxed text-foreground/90">{course.desc}</p>

              <h2 className="mt-9 mb-3 text-sm font-bold uppercase tracking-wide text-gold">
                What You Will Learn
              </h2>
              <ul className="grid gap-1.5">
                {course.syllabus.map((s) => (
                  <li
                    key={s.title + s.detail}
                    className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-sm"
                  >
                    <span className="font-semibold text-gold-light">{s.title}:</span> {s.detail}
                  </li>
                ))}
              </ul>

              <h2 className="mt-9 mb-3 text-sm font-bold uppercase tracking-wide text-gold">
                What&apos;s Included
              </h2>
              <ul className="space-y-2">
                {course.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: sticky payment box */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="rounded-2xl border border-gold/30 bg-[#14171d] p-4 sm:p-7">
                <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-gold">
                  Complete Your Payment
                </h2>
                <div className="rounded-xl border border-dashed border-gold/30 bg-gold/[0.06] px-4 sm:px-5 py-7 text-center">
                  <div className="text-3xl font-extrabold text-gold-light">
                    ₹{course.amount.toLocaleString("en-IN")}
                  </div>
                  <div className="text-muted-foreground text-sm mb-4">
                    Paying to: {CONFIG.payeeName}
                  </div>

                  <div className="mx-auto mb-4 inline-block rounded-xl bg-white p-3">
                    <QRCodeCanvas value={upiLink(courseKey)} size={200} marginSize={0} />
                  </div>

                  <div className="mb-4">
                    <span className="inline-block rounded-lg bg-white/5 px-4 py-1.5 font-mono text-sm">
                      {CONFIG.upiId}
                    </span>
                  </div>

                  <ol className="mx-auto mb-5 max-w-sm list-decimal pl-5 text-left text-[13.5px] text-muted-foreground space-y-1">
                    <li>Scan the QR code with any UPI app (GPay, PhonePe, Paytm)</li>
                    <li>Pay the exact course amount shown above</li>
                    <li>Take a screenshot of the payment confirmation</li>
                    <li>Send it to us on WhatsApp — you&apos;ll get access within 24 hours</li>
                  </ol>

                  <a
                    href={whatsappLink(courseKey)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25d366] px-6 py-3 font-bold text-[#06240f] hover:brightness-105 transition"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 2.6 1.1 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" />
                    </svg>
                    Send Payment Screenshot
                  </a>

                  <div className="mt-4">
                    <button
                      onClick={confirmPayment}
                      className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light px-6 py-3.5 font-bold text-[#1a1405] hover:brightness-110 transition active:scale-[0.98] cursor-pointer"
                    >
                      I&apos;ve Completed the Payment ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
