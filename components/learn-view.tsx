"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Lock,
  PlayCircle,
  Video,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { VideoEmbed } from "@/components/ui/video-embed";
import { isEnrolled, getCompletedLessons, setLessonComplete } from "@/lib/enrollments";
import { COURSES, CONFIG, type CourseKey } from "@/lib/courses";

export function LearnView({ courseKey }: { courseKey: CourseKey }) {
  const course = COURSES[courseKey];
  // null = still checking (avoids hydration mismatch since enrollment lives in localStorage)
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setEnrolled(isEnrolled(courseKey));
    const done = getCompletedLessons(courseKey);
    setCompleted(done);
    // resume from the first incomplete lesson
    const firstIncomplete = COURSES[courseKey].syllabus.findIndex((_, i) => !done.includes(i));
    setCurrent(firstIncomplete === -1 ? 0 : firstIncomplete);
  }, [courseKey]);

  if (enrolled === null) {
    return (
      <div className="min-h-screen">
        <Navbar />
      </div>
    );
  }

  /* ---------- Not enrolled: gate ---------- */
  if (!enrolled) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex max-w-lg flex-col items-center px-5 pt-40 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold">This course is locked</h1>
          <p className="mt-2 text-muted-foreground">
            You haven&apos;t enrolled in the {course.name} yet. Enroll to unlock all lessons.
          </p>
          <Link
            href={`/enroll/${courseKey}`}
            className="mt-6 rounded-xl bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 font-bold text-[#1a1405] hover:brightness-110 transition"
          >
            Enroll Now — ₹{course.amount.toLocaleString("en-IN")}
          </Link>
        </main>
      </div>
    );
  }

  const lessons = course.syllabus;
  const lesson = lessons[current];
  const isDone = completed.includes(current);
  const progressPct = Math.round((completed.length / lessons.length) * 100);

  const markComplete = (done: boolean) => {
    setCompleted(setLessonComplete(courseKey, current, done));
    if (done && current < lessons.length - 1) setCurrent(current + 1);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-24">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        {/* Course header + progress */}
        <div className="mb-8">
          <div className="text-gold text-xs font-bold uppercase tracking-[0.15em]">{course.type}</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight">{course.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 max-w-sm overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gold-light">
              {progressPct}% · {completed.length}/{lessons.length} lessons
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Lesson list */}
          <aside className="order-2 lg:order-1 h-fit rounded-2xl border border-white/10 bg-[#14171d] p-4 lg:sticky lg:top-24">
            <h2 className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.15em] text-gold">
              Course Content
            </h2>
            <ul className="space-y-1">
              {lessons.map((l, i) => {
                const done = completed.includes(i);
                const active = i === current;
                return (
                  <li key={l.title + l.detail}>
                    <button
                      onClick={() => setCurrent(i)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${
                        active ? "bg-gold/10 border border-gold/30" : "border border-transparent hover:bg-white/5"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${active ? "text-gold-light" : ""}`}>
                          {l.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{l.detail}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {courseKey === "live" && (
              <a
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                  "Hi! I'm enrolled in the Live Mentorship Batch. Please share the Zoom link / batch schedule."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gold/30 px-4 py-3 text-sm font-bold text-gold hover:bg-gold/10 transition"
              >
                <Video className="h-4 w-4" /> Get Live Session Link
              </a>
            )}
          </aside>

          {/* Current lesson */}
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl border border-white/10 bg-[#14171d] p-5 md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                Lesson {current + 1} of {lessons.length}
              </div>
              <h2 className="mt-1 text-xl md:text-2xl font-bold">{lesson.title}</h2>
              <p className="mt-1 text-muted-foreground">{lesson.detail}</p>

              {/* Video area */}
              <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                {lesson.videoUrl ? (
                  <VideoEmbed
                    key={`${current}-${lesson.videoUrl}`}
                    url={lesson.videoUrl}
                    title={lesson.title}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)] text-center px-6">
                    <PlayCircle className="h-14 w-14 text-gold/60" />
                    <p className="text-sm font-semibold">Lesson video coming soon</p>
                    <p className="max-w-sm text-xs text-muted-foreground">
                      {courseKey === "live"
                        ? "This lesson is covered in the live Zoom sessions. The recording will appear here after class."
                        : "The video for this lesson will be available here shortly."}
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between">
                <button
                  onClick={() => markComplete(!isDone)}
                  className={`order-first col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition active:scale-[0.98] cursor-pointer sm:order-none sm:col-span-1 sm:w-auto ${
                    isDone
                      ? "border border-green-500/40 text-green-500 hover:bg-green-500/10"
                      : "bg-gradient-to-r from-gold to-gold-light text-[#1a1405] hover:brightness-110"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isDone ? "Completed — Undo" : "Mark as Complete"}
                </button>

                <button
                  onClick={() => setCurrent(Math.max(0, current - 1))}
                  disabled={current === 0}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer sm:-order-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <button
                  onClick={() => setCurrent(Math.min(lessons.length - 1, current + 1))}
                  disabled={current === lessons.length - 1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {progressPct === 100 && (
              <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
                <p className="text-lg font-bold text-green-500">🎉 Congratulations — course completed!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Message us on WhatsApp to receive your certificate of completion.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
