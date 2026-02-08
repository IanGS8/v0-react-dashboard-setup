import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function calculateComplementarity(
  mine: Record<string, number>,
  theirs: Record<string, number>,
): number {
  const keys = [
    "comunicacao",
    "pensamento_critico",
    "resolucao_problemas",
    "colaboracao",
    "criatividade",
    "gestao_tempo",
  ];

  let complementScore = 0;
  for (const key of keys) {
    // Higher score when partner is strong where I'm weak and vice versa
    const diff = Math.abs(mine[key] - theirs[key]);
    const avgStrength = (mine[key] + theirs[key]) / 2;
    complementScore += diff * 0.6 + avgStrength * 0.4;
  }

  // Normalize to 0-100
  const maxPossible = keys.length * (10 * 0.6 + 10 * 0.4);
  return Math.round((complementScore / maxPossible) * 100);
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // Get my competencies
  const { data: myComp } = await supabase
    .from("competencies")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!myComp) {
    return NextResponse.json(
      { error: "Competencias nao encontradas" },
      { status: 404 },
    );
  }

  // Get all other users' competencies
  const { data: allComps } = await supabase
    .from("competencies")
    .select("*, profiles(id, display_name, avatar_url, level, xp)")
    .neq("user_id", user.id);

  if (!allComps || allComps.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  // Calculate complementarity for each
  const scored = allComps.map((comp) => ({
    profile: comp.profiles,
    competencies: {
      comunicacao: comp.comunicacao,
      pensamento_critico: comp.pensamento_critico,
      resolucao_problemas: comp.resolucao_problemas,
      colaboracao: comp.colaboracao,
      criatividade: comp.criatividade,
      gestao_tempo: comp.gestao_tempo,
    },
    score: calculateComplementarity(myComp, comp),
  }));

  // Sort by score descending and take top 10
  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.slice(0, 10);

  return NextResponse.json({ matches: topMatches });
}
