import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: guilds } = await supabase
    .from("guilds")
    .select(
      "*, guild_members(count), my_membership:guild_members!inner(user_id)"
    )
    .eq("guild_members.user_id", user.id);

  const { data: allGuilds } = await supabase
    .from("guilds")
    .select("*, guild_members(count)");

  const myGuildIds = new Set(
    (guilds || []).map((g: any) => g.id)
  );

  const enriched = (allGuilds || []).map((g: any) => ({
    ...g,
    member_count: g.guild_members?.[0]?.count || 0,
    is_member: myGuildIds.has(g.id),
  }));

  return NextResponse.json({ guilds: enriched });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, focus_area } = body;

  if (!name || !focus_area) {
    return NextResponse.json(
      { error: "Nome e area de foco obrigatorios" },
      { status: 400 }
    );
  }

  const { data: guild, error } = await supabase
    .from("guilds")
    .insert({
      name,
      description: description || null,
      focus_area,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("guild_members").insert({
    guild_id: guild.id,
    user_id: user.id,
    role: "leader",
  });

  await supabase.rpc("increment_xp", { uid: user.id, amount: 30 });

  return NextResponse.json({ guild });
}
