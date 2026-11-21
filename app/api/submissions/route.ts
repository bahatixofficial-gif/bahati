import { NextResponse } from "next/server";
import { getAdminSession } from "../../lib/admin-session";
import {
  addSubmission,
  getSubmissions,
  updateSubmissionStatus,
} from "../../lib/submissions";

export async function POST(request: Request) {
  const body = await request.json();
  const type = body.type;

  if (type !== "order" && type !== "contact") {
    return NextResponse.json({ error: "Invalid submission type" }, { status: 400 });
  }

  const data = body.data;
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid submission data" }, { status: 400 });
  }

  const cleanedData = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => typeof value === "string")
      .map(([key, value]) => [key, String(value).trim().slice(0, 2000)]),
  );

  const submission = await addSubmission({ type, data: cleanedData });
  return NextResponse.json({ submission }, { status: 201 });
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ submissions: await getSubmissions() });
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (typeof body.id !== "string" || !["new", "read"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  await updateSubmissionStatus(body.id, body.status);
  return NextResponse.json({ success: true });
}
