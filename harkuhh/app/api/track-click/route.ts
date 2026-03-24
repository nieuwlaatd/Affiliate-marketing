import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { deal_id } = await request.json();
  if (!deal_id) {
    return NextResponse.json({ error: "Missing deal_id" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("deal_clicks").insert({ deal_id });

  return NextResponse.json({ success: true });
}
