"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SaveButton({
  dealId,
  onAuthRequired,
}: {
  dealId: string;
  onAuthRequired?: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkSaved();
  }, [dealId]);

  async function checkSaved() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("saved_deals")
      .select("id")
      .eq("user_id", user.id)
      .eq("deal_id", dealId)
      .maybeSingle();
    setSaved(!!data);
  }

  async function toggle() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onAuthRequired?.();
      return;
    }

    setLoading(true);
    if (saved) {
      await supabase
        .from("saved_deals")
        .delete()
        .eq("user_id", user.id)
        .eq("deal_id", dealId);
      setSaved(false);
    } else {
      await supabase
        .from("saved_deals")
        .insert({ user_id: user.id, deal_id: dealId });
      setSaved(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Deal verwijderen uit opgeslagen" : "Deal opslaan"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={saved ? "text-[var(--accent)]" : ""}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
