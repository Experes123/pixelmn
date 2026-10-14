import { promises as fs } from "fs";
import path from "path";
import { defaults, type Content } from "@/content/site";

const dir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const file = path.join(dir, "content.json");

function isObj(v: unknown): v is Record<string, unknown> { return !!v && typeof v === "object" && !Array.isArray(v); }

// Objects merge key-by-key (so new default fields appear); arrays and primitives are replaced by saved values.
function merge<T>(base: T, saved: unknown): T {
  if (isObj(base) && isObj(saved)) {
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(base)) if (k in saved) out[k] = merge((base as Record<string, unknown>)[k], saved[k]);
    return out as T;
  }
  if (Array.isArray(base)) return (Array.isArray(saved) ? saved : base) as T;
  return (typeof saved === typeof base ? saved : base) as T;
}

export async function getContent(): Promise<Content> {
  try { return merge(defaults, JSON.parse(await fs.readFile(file, "utf8"))); } catch { return defaults; }
}

export async function saveContent(raw: unknown): Promise<Content> {
  const c = merge(defaults, raw);
  await fs.mkdir(dir, { recursive: true });
  const tmp = file + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(c, null, 2));
  await fs.rename(tmp, file);
  return c;
}

export async function resetContent() { await fs.rm(file, { force: true }); }
