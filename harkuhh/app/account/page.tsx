"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
      setEmailNotifications(data.email_notifications);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        email_notifications: emailNotifications,
      })
      .eq("id", profile.id);

    if (error) {
      setMessage("Er ging iets mis. Probeer het opnieuw.");
    } else {
      setMessage("Profiel opgeslagen!");
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Mijn account</h1>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Profiel</h2>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Weergavenaam
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
            />
            <label htmlFor="emailNotifications" className="text-sm text-[var(--foreground)]">
              E-mail notificaties ontvangen
            </label>
          </div>

          {message && (
            <p className={`text-sm ${message.includes("mis") ? "text-red-500" : "text-[var(--accent)]"}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="h-11 rounded-xl bg-[var(--accent)] text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Snelkoppelingen</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Link
            href="/account/opgeslagen"
            className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 transition-colors hover:border-[var(--accent)]"
          >
            <span className="text-sm font-medium text-[var(--foreground)]">Opgeslagen deals</span>
            <span className="text-[var(--muted)]">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 text-sm text-[var(--muted)] hover:text-red-500"
      >
        Uitloggen
      </button>
    </div>
  );
}
