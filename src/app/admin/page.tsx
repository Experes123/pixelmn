import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/auth";
import { getContent } from "@/lib/store";
import { Editor } from "@/components/admin/Editor";
import { Login } from "@/components/admin/Login";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!adminEnabled())
    return (
      <main className="grid min-h-dvh place-items-center bg-mist p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-xl font-bold">Admin is not configured</h1>
          <p className="text-sm text-neutral-600">Set the environment variable <code className="rounded bg-mist px-1">ADMIN_PASSWORD</code> (at least 8 characters) and restart the server. Optionally set <code className="rounded bg-mist px-1">DATA_DIR</code> to a persistent folder.</p>
        </div>
      </main>
    );
  if (!(await isAdmin())) return <Login />;
  return <Editor initial={await getContent()} />;
}
