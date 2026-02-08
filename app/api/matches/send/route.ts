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

  const { partnerId, score } = await request.json();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Partner ID obrigatorio" },
      { status: 400 },
    );
  }

  // Check if match already exists
  const { data: existing } = await supabase
    .from("matches")
    .select("id")
    .eq("user_id", user.id)
    .eq("partner_id", partnerId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Match ja enviado" },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from("matches")
    .insert({
      user_id: user.id,
      partner_id: partnerId,
      compatibility_score: score ?? 0,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ match: data });
}
