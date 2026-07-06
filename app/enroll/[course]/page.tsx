import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EnrollView } from "@/components/enroll-view";
import { COURSES, type CourseKey } from "@/lib/courses";

export function generateStaticParams() {
  return Object.keys(COURSES).map((course) => ({ course }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  const data = COURSES[course as CourseKey];
  if (!data) return {};
  return {
    title: `Enroll — ${data.name} | nikki.fx`,
    description: data.desc,
  };
}

export default async function EnrollPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!(course in COURSES)) notFound();
  return <EnrollView courseKey={course as CourseKey} />;
}
