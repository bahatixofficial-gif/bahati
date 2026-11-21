import { promises as fs } from "node:fs";
import path from "node:path";

export type Submission = {
  id: string;
  type: "order" | "contact";
  status: "new" | "read";
  createdAt: string;
  data: Record<string, string>;
};

const dataDirectory = path.join(process.cwd(), "data");
const submissionsFile = path.join(dataDirectory, "submissions.json");

async function ensureStorage() {
  await fs.mkdir(dataDirectory, { recursive: true });
  try {
    await fs.access(submissionsFile);
  } catch {
    await fs.writeFile(submissionsFile, "[]", "utf8");
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  await ensureStorage();
  const contents = await fs.readFile(submissionsFile, "utf8");
  const submissions = JSON.parse(contents) as Submission[];
  return submissions.sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export async function addSubmission(
  submission: Omit<Submission, "id" | "status" | "createdAt">,
) {
  await ensureStorage();
  const submissions = await getSubmissions();
  const newSubmission: Submission = {
    ...submission,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await fs.writeFile(
    submissionsFile,
    JSON.stringify([newSubmission, ...submissions], null, 2),
    "utf8",
  );
  return newSubmission;
}

export async function updateSubmissionStatus(id: string, status: Submission["status"]) {
  await ensureStorage();
  const submissions = await getSubmissions();
  const updated = submissions.map((submission) =>
    submission.id === id ? { ...submission, status } : submission,
  );
  await fs.writeFile(submissionsFile, JSON.stringify(updated, null, 2), "utf8");
}
