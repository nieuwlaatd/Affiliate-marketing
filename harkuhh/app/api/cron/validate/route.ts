import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get all active deals
  const { data: deals } = await supabase
    .from("deals")
    .select("id, affiliate_link, brand, product")
    .eq("is_active", true);

  if (!deals || deals.length === 0) {
    return NextResponse.json({ message: "No deals to validate", checked: 0 });
  }

  let checked = 0;
  let failed = 0;

  for (const deal of deals) {
    try {
      const response = await fetch(deal.affiliate_link, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });

      const isValid = response.ok;

      await supabase.from("deal_checks").insert({
        deal_id: deal.id,
        is_valid: isValid,
        error_message: isValid ? null : `HTTP ${response.status}`,
      });

      if (!isValid) {
        failed++;

        // Check if this deal has failed 3 times in a row
        const { data: recentChecks } = await supabase
          .from("deal_checks")
          .select("is_valid")
          .eq("deal_id", deal.id)
          .order("checked_at", { ascending: false })
          .limit(3);

        if (recentChecks && recentChecks.length >= 3 && recentChecks.every((c) => !c.is_valid)) {
          await supabase.from("deals").update({ is_active: false }).eq("id", deal.id);
        }
      }

      checked++;
    } catch (err: any) {
      await supabase.from("deal_checks").insert({
        deal_id: deal.id,
        is_valid: false,
        error_message: err.message || "Fetch failed",
      });
      failed++;
      checked++;
    }
  }

  return NextResponse.json({
    message: "Validation complete",
    checked,
    failed,
  });
}
