import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const { matchId, status } = await request.json();

  if (!matchId || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", matchId)
    .eq("partner_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award XP for accepted matches
  if (status === "accepted") {
    const xpBonus = 25;
    // Award to both users
    await supabase.rpc("increment_xp", { uid: data.user_id, amount: xpBonus }).catch(() => {});
    await supabase.rpc("increment_xp", { uid: data.partner_id, amount: xpBonus }).catch(() => {});
  }

  return NextResponse.json({ match: data });
}
