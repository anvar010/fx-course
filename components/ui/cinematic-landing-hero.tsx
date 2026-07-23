"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useState, useEffect } from "react";

export function CinematicHero() {
  const [students, setStudents] = useState(0);

  useEffect(() => {
    // Count up animation for students
    const timer = setTimeout(() => {
      setStudents(400);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background pt-20">
      {/* Background gradients */}
      <div className="absolute top-0 -translate-y-1/2 w-full h-[50vh] bg-gold/10 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-0 translate-y-1/2 w-full h-[30vh] bg-gold-light/10 blur-[100px] rounded-[100%] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDIxMiwgMTc1LCA1NSwgMC4xNSkiLz4KPC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center mx-auto mt-[-5vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-sm font-medium text-gold mb-8 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <span className="flex h-2 w-2 rounded-full bg-gold mr-2 animate-pulse" />
          Enrollments are now open
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6"
        >
          Master XAUUSD.
          <br />
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            Trade with precision.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-[600px] text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          Learn the exact institutional trading strategies used to conquer the gold market. No fluff, just pure price action and risk management.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="#courses"
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-8 py-4 text-sm font-bold text-[#1a1405] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          >
            Start Learning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Student Login
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8"
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white flex items-center">
              <NumberFlow value={students} />+
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Students</div>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white">4.9/5</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Rating</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground/50 animate-bounce"
      >
        <span className="text-[10px] uppercase tracking-widest mb-2">Scroll to explore</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
