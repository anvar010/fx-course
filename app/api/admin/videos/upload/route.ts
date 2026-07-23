import { NextResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const courseKey = formData.get("courseKey") as string | null;
    const lessonTitle = formData.get("lessonTitle") as string | null;

    if (!file || !courseKey || !lessonTitle) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Prepare upload directory
    const uploadDir = process.env.UPLOAD_DIR || "./uploads";
    await mkdir(uploadDir, { recursive: true });

    // Generate safe filename
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filepath = path.join(uploadDir, safeFilename);

    // Convert Web File to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    // We check if a video already exists for this lesson to overwrite the entry
    const existingVideo = await db.video.findFirst({
      where: { courseKey, lessonTitle },
    });

    let video;
    if (existingVideo) {
      video = await db.video.update({
        where: { id: existingVideo.id },
        data: { filename: safeFilename, filepath },
      });
    } else {
      video = await db.video.create({
        data: {
          courseKey,
          lessonTitle,
          filename: safeFilename,
          filepath,
        },
      });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
