import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Panel</h1>
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          &larr; Terug naar site
        </Link>
      </div>

      {/* Admin navigation */}
      <nav className="mb-8 flex gap-2 border-b border-[var(--border)] pb-4">
        <Link
          href="/admin"
          className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/deals"
          className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
        >
          Deals
        </Link>
      </nav>

      {children}
    </div>
  );
}
