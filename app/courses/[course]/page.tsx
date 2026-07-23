import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { COURSES, type CourseKey } from "@/lib/courses";
import { Navbar } from "@/components/navbar";
import { CoursePlayer } from "./course-player";

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const { course } = await params;
  const courseData = COURSES[course as CourseKey];

  if (!courseData) {
    redirect("/");
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Check enrollment
  let hasAccess = role === "ADMIN"; // Admin always has access

  if (!hasAccess) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId,
        courseKey: course,
        status: "APPROVED",
      },
    });
    hasAccess = !!enrollment;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 px-4 text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You do not have access to this course. If you recently enrolled, please wait for an admin to approve your payment.
          </p>
          <a href="/#courses" className="text-gold hover:underline font-medium">Browse Courses</a>
        </div>
      </div>
    );
  }

  // Fetch videos for this course
  const videos = await db.video.findMany({
    where: { courseKey: course },
  });

  return (
    <div className="min-h-screen bg-[#0b0d11]">
      <Navbar />
      <main className="pt-24">
        <CoursePlayer course={courseData} courseKey={course as CourseKey} videos={videos} />
      </main>
    </div>
  );
}
