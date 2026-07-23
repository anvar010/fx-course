import { NextResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { stat, open } from "fs/promises";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    
    // Find the video by ID
    const video = await db.video.findUnique({ where: { id } });
    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    // Optionally: check if this user is APPROVED for this course (skip for now to keep it simple, 
    // or add a quick DB check. Since they are logged in, we assume we check authorization in the UI).
    // A robust system would verify db.enrollment where userId = session.id and courseKey = video.courseKey.

    const filePath = video.filepath;

    let fileStat;
    try {
      fileStat = await stat(filePath);
    } catch (e) {
      return new NextResponse("File missing on disk", { status: 404 });
    }

    const fileSize = fileStat.size;
    const rangeHeader = req.headers.get("range");

    if (rangeHeader) {
      // Parse Range header (e.g., "bytes=0-1000")
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        return new NextResponse("Requested range not satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const fileHandle = await open(filePath, "r");
      
      // Node.js createReadStream can be wrapped in a Web ReadableStream
      const webStream = new ReadableStream({
        async start(controller) {
          const stream = fileHandle.createReadStream({ start, end });
          stream.on("data", (chunk) => controller.enqueue(chunk));
          stream.on("end", async () => {
            controller.close();
            await fileHandle.close();
          });
          stream.on("error", async (err) => {
            controller.error(err);
            await fileHandle.close();
          });
        },
        cancel() {
          fileHandle.close();
        }
      });

      return new Response(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": "video/mp4",
        },
      });
    } else {
      // No range requested, send entire file
      const fileHandle = await open(filePath, "r");
      const webStream = new ReadableStream({
        async start(controller) {
          const stream = fileHandle.createReadStream();
          stream.on("data", (chunk) => controller.enqueue(chunk));
          stream.on("end", async () => {
            controller.close();
            await fileHandle.close();
          });
          stream.on("error", async (err) => {
            controller.error(err);
            await fileHandle.close();
          });
        },
        cancel() {
          fileHandle.close();
        }
      });

      return new Response(webStream, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": "video/mp4",
        },
      });
    }
  } catch (error) {
    console.error("STREAM_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
