import { promises as fs } from "fs";
import path from "path";
import { heroes } from "../data/heroes";

export type Submission = {
  id: string;
  type: "order" | "contact";
  status: "new" | "read" | "archived";
  createdAt: string;
  data: Record<string, string>;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "submissions.json");

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function notifyDiscord(
  type: "order" | "contact",
  data: Record<string, string>,
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const isOrder = type === "order";
  const matchedHero = isOrder
    ? heroes.find(
        (h) => h.name.toUpperCase() === (data.hero || "").toUpperCase(),
      )
    : undefined;

  const heroDisplayName = matchedHero
    ? toTitleCase(matchedHero.name)
    : toTitleCase(data.hero || "Unknown Hero");

  const roleDisplayName = matchedHero ? toTitleCase(matchedHero.role) : "";

  const orderLines = [
    `**New Boost Order**`,
    `A new boost request has been submitted through the website.`,
    ``,
    `• Order details:`,
    `> • **Hero:** ${heroDisplayName}${roleDisplayName ? ` (${roleDisplayName})` : ""}`,
    `> • **Service:** ${data.service || "Not provided"}`,
    `> • **Price:** ${data.price || "Not provided"}`,
    `> • **Discord:** \`${data.discord || "Not provided"}\``,
    ...(data.email && data.email !== "Not provided"
      ? [`> • **Email:** ${data.email}`]
      : []),
    ...(data.notes && data.notes !== "-"
      ? [`> • **Notes:** ${data.notes}`]
      : []),
    ``,
    `**Reach out via Discord DM to confirm and begin the boost.**`,
  ];

  const contactLines = [
    `**New Support Question**`,
    `A visitor submitted a question from the contact page.`,
    ``,
    `• Inquiry details:`,
    `> • **Name:** ${data.name || "Not provided"}`,
    `> • **Discord:** \`${data.discord || "Not provided"}\``,
    `> • **Subject:** ${data.subject || "General inquiry"}`,
    `> • **Message:** ${data.message || "-"}`,
    ``,
    `**Reply via Discord DM when available.**`,
  ];

  const embed = {
    description: (isOrder ? orderLines : contactLines).join("\n"),
    color: 0x2b2d31,
    thumbnail: matchedHero?.image ? { url: matchedHero.image } : undefined,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "<@1260018273664372922>",
        allowed_mentions: {
          users: ["1260018273664372922"],
        },
        embeds: [embed],
      }),
    });
  } catch (error) {
    console.error("Discord webhook failed:", error);
  }
}

async function readSubmissionsFile(): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSubmissionsFile(submissions: Submission[]): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(submissions, null, 2), "utf-8");
}

export async function getSubmissions(): Promise<Submission[]> {
  const submissions = await readSubmissionsFile();
  return submissions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addSubmission(input: {
  type: "order" | "contact";
  data: Record<string, string>;
}): Promise<Submission> {
  const submissions = await readSubmissionsFile();
  const newSubmission: Submission = {
    id: crypto.randomUUID(),
    type: input.type,
    status: "new",
    createdAt: new Date().toISOString(),
    data: input.data,
  };

  submissions.unshift(newSubmission);
  await writeSubmissionsFile(submissions);
  await notifyDiscord(input.type, input.data);
  return newSubmission;
}

export async function updateSubmissionStatus(
  id: string,
  status: "new" | "read" | "archived",
): Promise<void> {
  const submissions = await readSubmissionsFile();
  const updated = submissions.map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  await writeSubmissionsFile(updated);
}
