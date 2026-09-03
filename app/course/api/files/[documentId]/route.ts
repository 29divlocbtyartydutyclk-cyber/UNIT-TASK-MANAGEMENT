import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCourseSession } from "@/lib/course/auth/server";
import { openCourseReadStream, statCourseFile } from "@/lib/course/files/storage";

export async function GET(request: NextRequest, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const session = await getCourseSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const document = await prisma.courseDocument.findUnique({
    where: { id: documentId },
    include: { course: true },
  });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const authorized = session.role === "ADMIN" || session.category === document.course.category;
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let stat;
  try {
    stat = await statCourseFile(document.storedFilePath);
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const stream = openCourseReadStream(document.storedFilePath);
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Length": String(stat.size),
      "Content-Disposition": `inline; filename="${encodeURIComponent(document.originalName)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
