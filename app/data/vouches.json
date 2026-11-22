import { promises as fs } from "fs";
import path from "path";

export type Vouch = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "vouches.json");

async function readVouchesFile(): Promise<Vouch[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeVouchesFile(vouches: Vouch[]): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(vouches, null, 2), "utf-8");
}

export async function getVouches(): Promise<Vouch[]> {
  const vouches = await readVouchesFile();
  return vouches.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addVouch(input: {
  title: string;
  description: string;
  imageUrl: string;
}): Promise<Vouch> {
  const vouches = await readVouchesFile();
  const newVouch: Vouch = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
  };

  vouches.unshift(newVouch);
  await writeVouchesFile(vouches);
  return newVouch;
}

export async function deleteVouch(id: string): Promise<void> {
  const vouches = await readVouchesFile();
  const target = vouches.find((v) => v.id === id);

  if (target?.imageUrl?.startsWith("/uploads/vouches/")) {
    const diskPath = path.join(process.cwd(), "public", target.imageUrl);
    await fs.unlink(diskPath).catch(() => {});
  }

  await writeVouchesFile(vouches.filter((v) => v.id !== id));
}
