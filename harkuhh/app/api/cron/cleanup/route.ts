import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  // Deactivate expired deals
  const { data: expired, error } = await supabase
    .from("deals")
    .update({ is_active: false })
    .eq("is_active", true)
    .lt("expires_at", now)
    .select("id, brand, product");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Cleanup complete",
    deactivated: expired?.length ?? 0,
    deals: expired?.map((d) => `${d.brand} — ${d.product}`) ?? [],
  });
}
