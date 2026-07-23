"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle2, Lock } from "lucide-react";
import type { Course, CourseKey } from "@/lib/courses";

type Video = {
  id: string;
  courseKey: string;
  lessonTitle: string;
};

export function CoursePlayer({ course, courseKey, videos }: { course: Course, courseKey: CourseKey, videos: Video[] }) {
  const [activeLesson, setActiveLesson] = useState(course.syllabus[0]);

  const activeVideo = videos.find((v) => v.lessonTitle === activeLesson.title);

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-8">
        <div className="text-gold text-xs font-bold uppercase tracking-widest mb-2">{course.type}</div>
        <h1 className="text-3xl font-bold text-white">{course.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Video Player */}
        <div className="flex flex-col">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {activeVideo ? (
              <video 
                src={`/api/videos/stream/${activeVideo.id}`}
                controls
                controlsList="nodownload"
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#14171d]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <PlayCircle className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Video Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  This lesson video has not been uploaded yet. Check back later or contact your instructor.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-2">{activeLesson.title}: {activeLesson.detail}</h2>
            <p className="text-muted-foreground">Watch the lesson above. Pay attention to the risk management guidelines taught in this module.</p>
          </div>
        </div>

        {/* Syllabus Sidebar */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light mb-2">Course Syllabus</h3>
          <div className="space-y-2">
            {course.syllabus.map((lesson, index) => {
              const hasVideo = videos.some((v) => v.lessonTitle === lesson.title);
              const isActive = activeLesson.title === lesson.title;
              
              return (
                <button
                  key={lesson.title}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isActive 
                      ? "bg-gold/10 border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.05)]" 
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={`text-xs font-bold mb-1 ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                        Module {index + 1}
                      </div>
                      <div className={`font-semibold ${isActive ? "text-white" : "text-white/80"}`}>
                        {lesson.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {lesson.detail}
                      </div>
                    </div>
                    {hasVideo ? (
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${isActive ? "text-gold" : "text-emerald-500/50"}`} />
                    ) : (
                      <Lock className="w-4 h-4 shrink-0 text-white/20" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
