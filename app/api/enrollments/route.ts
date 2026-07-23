import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseKey, courseName, amount, orderId } = await req.json();

    if (!courseKey || !courseName || !amount || !orderId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const userId = (session.user as any).id;

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseKey,
        courseName,
        amount,
        orderId,
        status: "PENDING",
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("ENROLLMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role === "ADMIN") {
      // Admins can see all enrollments
      const enrollments = await db.enrollment.findMany({
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(enrollments);
    } else {
      // Students only see their own
      const enrollments = await db.enrollment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(enrollments);
    }
  } catch (error) {
    console.error("GET_ENROLLMENTS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
