import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LearnView } from "@/components/learn-view";
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
    title: `${data.name} — My Course | nikki.fx`,
    description: data.desc,
  };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!(course in COURSES)) notFound();
  return <LearnView courseKey={course as CourseKey} />;
}
