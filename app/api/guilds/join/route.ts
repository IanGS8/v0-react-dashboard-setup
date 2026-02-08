import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guild_id } = await request.json();

  const { data: existing } = await supabase
    .from("guild_members")
    .select("id")
    .eq("guild_id", guild_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Voce ja faz parte desta guilda" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("guild_members").insert({
    guild_id,
    user_id: user.id,
    role: "member",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.rpc("increment_xp", { uid: user.id, amount: 15 });

  return NextResponse.json({ success: true });
}
