"use client";

import { useEffect, useState } from "react";
import { Upload, FileVideo, CheckCircle2 } from "lucide-react";
import { COURSES } from "@/lib/courses";

type Video = {
  id: string;
  courseKey: string;
  lessonTitle: string;
  filename: string;
  createdAt: string;
};

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, courseKey: string, lessonTitle: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(`${courseKey}-${lessonTitle}`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseKey", courseKey);
    formData.append("lessonTitle", lessonTitle);

    try {
      const res = await fetch("/api/admin/videos/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchVideos();
        alert("Video uploaded successfully!");
      } else {
        alert("Failed to upload video.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading video.");
    } finally {
      setUploading(null);
    }
  };

  const getVideoForLesson = (courseKey: string, lessonTitle: string) => {
    return videos.find((v) => v.courseKey === courseKey && v.lessonTitle === lessonTitle);
  };

  if (loading) return <div className="p-10 text-center text-white">Loading videos...</div>;

  return (
    <div className="container mx-auto px-4 pb-20 text-white">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Management</h1>
          <p className="text-muted-foreground mt-2">Upload course videos securely to your local server.</p>
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(COURSES).map(([courseKey, course]) => (
          <div key={courseKey} className="rounded-xl border border-white/10 bg-[#14171d] overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-gold-light">{course.name}</h2>
              <p className="text-sm text-muted-foreground">Manage videos for {course.type}</p>
            </div>
            <div className="divide-y divide-white/5">
              {course.syllabus.map((lesson) => {
                const existingVideo = getVideoForLesson(courseKey, lesson.title);
                const isUploading = uploading === `${courseKey}-${lesson.title}`;

                return (
                  <div key={lesson.title} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                        <FileVideo className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.detail}</p>
                        {existingVideo && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Uploaded: {existingVideo.filename}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="shrink-0 relative">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(e) => handleUpload(e, courseKey, lesson.title)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={isUploading}
                      />
                      <button 
                        disabled={isUploading}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition disabled:opacity-50"
                      >
                        {isUploading ? (
                          <span className="animate-pulse">Uploading...</span>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {existingVideo ? "Replace Video" : "Upload Video"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
