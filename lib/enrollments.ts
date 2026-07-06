export type Enrollment = {
  courseKey: "live" | "recorded";
  courseName: string;
  amount: number;
  orderId: string;
  dateTime: string;
};

const STORAGE_KEY = "xauusd-enrollments";
export const ENROLLMENTS_CHANGED_EVENT = "enrollments-changed";

export function getEnrollments(): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Enrollment[]) : [];
  } catch {
    return [];
  }
}

export function addEnrollment(enrollment: Enrollment) {
  const list = getEnrollments();
  list.push(enrollment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(ENROLLMENTS_CHANGED_EVENT));
}

export function isEnrolled(courseKey: Enrollment["courseKey"]): boolean {
  return getEnrollments().some((e) => e.courseKey === courseKey);
}

/* ---------- Lesson progress (per course, stored locally) ---------- */

const PROGRESS_KEY = "xauusd-progress";

type ProgressMap = Partial<Record<Enrollment["courseKey"], number[]>>;

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getCompletedLessons(courseKey: Enrollment["courseKey"]): number[] {
  return readProgress()[courseKey] ?? [];
}

export function setLessonComplete(
  courseKey: Enrollment["courseKey"],
  lessonIndex: number,
  done: boolean
): number[] {
  const map = readProgress();
  const current = new Set(map[courseKey] ?? []);
  if (done) current.add(lessonIndex);
  else current.delete(lessonIndex);
  map[courseKey] = [...current].sort((a, b) => a - b);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  return map[courseKey]!;
}
