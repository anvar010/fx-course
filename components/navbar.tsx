"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GraduationCap, ChevronDown, ChevronRight, BookOpenCheck, Video, PlaySquare } from "lucide-react";
import {
  getEnrollments,
  ENROLLMENTS_CHANGED_EVENT,
  type Enrollment,
} from "@/lib/enrollments";

export function Navbar() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setEnrollments(getEnrollments());
    refresh();
    window.addEventListener(ENROLLMENTS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ENROLLMENTS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[90] border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-sm font-black text-[#1a1405]">
            N
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            nikki
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              .fx
            </span>
          </span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-2 sm:gap-6">
          <a
            href="#courses"
            className="hidden sm:block text-sm font-medium text-muted-foreground transition hover:text-gold"
          >
            Courses
          </a>

          {/* Enrolled Courses dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gold/30 px-3 sm:px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10 cursor-pointer"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Enrolled Courses</span>
              <span className="sm:hidden">Enrolled</span>
              {enrollments.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-[11px] font-bold text-[#1a1405]">
                  {enrollments.length}
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-gold/25 bg-[#14171d] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-[pop_0.2s_ease]">
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gold">
                  My Enrolled Courses
                </div>

                {enrollments.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center">
                    <BookOpenCheck className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No course enrolled
                    </p>
                    <a
                      href="#courses"
                      onClick={() => setMenuOpen(false)}
                      className="mt-1 text-xs font-semibold text-gold hover:underline"
                    >
                      Browse courses →
                    </a>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {enrollments.map((e) => (
                      <li key={e.orderId}>
                        <Link
                          href={`/learn/${e.courseKey}`}
                          onClick={() => setMenuOpen(false)}
                          className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-gold/40 hover:bg-gold/5"
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                            {e.courseKey === "live" ? (
                              <Video className="h-4 w-4" />
                            ) : (
                              <PlaySquare className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold group-hover:text-gold-light">
                              {e.courseName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {e.orderId} · {e.dateTime}
                            </p>
                            <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-bold text-gold">
                              Start course <ChevronRight className="h-3 w-3" />
                            </p>
                          </div>
                          <span className="shrink-0 text-sm font-bold text-gold-light">
                            ₹{e.amount.toLocaleString("en-IN")}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
