import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "../../lib/admin-session";
import { addVouch, deleteVouch, getVouches } from "../../lib/vouches";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export async function GET() {
  return NextResponse.json({ vouches: await getVouches() });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim().slice(0, 140);
  const description = String(formData.get("description") || "")
    .trim()
    .slice(0, 1000);
  const file = formData.get("image");

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPG, WEBP, or GIF images are allowed" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeExt = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext)
    ? ext
    : "png";
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "vouches");
  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const vouch = await addVouch({
    title,
    description,
    imageUrl: `/uploads/vouches/${filename}`,
  });

  return NextResponse.json({ vouch }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing vouch id" }, { status: 400 });
  }

  await deleteVouch(id);
  return NextResponse.json({ success: true });
}
