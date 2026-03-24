import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalDeals },
    { count: activeDeals },
    { count: totalUsers },
    { count: subscribers },
  ] = await Promise.all([
    supabase.from("deals").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("email_subscribers").select("*", { count: "exact", head: true }),
  ]);

  const { data: expiredDeals } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .lt("expires_at", new Date().toISOString());

  const stats = [
    { label: "Totaal deals", value: totalDeals ?? 0, color: "text-[var(--foreground)]" },
    { label: "Actieve deals", value: activeDeals ?? 0, color: "text-[var(--accent)]" },
    { label: "Verlopen deals", value: expiredDeals?.length ?? 0, color: "text-orange-500" },
    { label: "Gebruikers", value: totalUsers ?? 0, color: "text-[var(--foreground)]" },
    { label: "Nieuwsbrief abonnees", value: subscribers ?? 0, color: "text-[var(--foreground)]" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--foreground)]">Dashboard</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            <p className={`mt-1 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
