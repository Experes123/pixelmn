import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getContent, resetContent, saveContent } from "@/lib/store";

const deny = () => NextResponse.json({ error: "Нэвтрээгүй байна." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return deny();
  return NextResponse.json(await getContent());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return deny();
  const text = await req.text();
  if (text.length > 1_000_000) return NextResponse.json({ error: "Агуулга хэт том байна." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return NextResponse.json({ error: "Буруу JSON." }, { status: 400 }); }
  try {
    const saved = await saveContent(body);
    revalidatePath("/", "layout");
    return NextResponse.json(saved);
  } catch (e) {
    console.error("save content failed", e);
    return NextResponse.json({ error: "Хадгалж чадсангүй (хадгалах хавтас бичигдэхүйц эсэхийг шалгана уу)." }, { status: 500 });
  }
}

export async function DELETE() {
  if (!(await isAdmin())) return deny();
  await resetContent();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
