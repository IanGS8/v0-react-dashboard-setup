import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function calculateComplementarity(
  mine: Record<string, number>,
  theirs: Record<string, number>,
): number {
  const keys = [
    "matematica",
    "portugues",
    "historia",
    "geografia",
    "fisica",
    "quimica",
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

export async function GET() {
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
      { error: "Notas nao encontradas" },
      { status: 404 },
    );
  }

  // Get all other users' competencies with their profiles
  const { data: allComps } = await supabase
    .from("competencies")
    .select("*, profiles!inner(id, display_name, avatar_url, level, xp, course, semester)")
    .neq("user_id", user.id);

  if (!allComps || allComps.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  const LABELS: Record<string, string> = {
    matematica: "Matematica",
    portugues: "Portugues",
    historia: "Historia",
    geografia: "Geografia",
    fisica: "Fisica",
    quimica: "Quimica",
  };
  const KEYS = Object.keys(LABELS);

  // Calculate complementarity and build response matching MatchCard interface
  const scored = allComps.map((comp: any) => {
    const profile = comp.profiles;
    const compValues: Record<string, number> = {};
    for (const k of KEYS) compValues[k] = comp[k] ?? 5;

    const sorted = KEYS.slice().sort((a, b) => compValues[b] - compValues[a]);
    const strengths = sorted.slice(0, 3).map((k) => LABELS[k]);
    const weaknesses = sorted.slice(-3).map((k) => LABELS[k]);

    return {
      id: profile.id,
      display_name: profile.display_name,
      course: profile.course ?? null,
      semester: profile.semester ?? null,
      xp: profile.xp ?? 0,
      level: profile.level ?? 1,
      score: calculateComplementarity(myComp, comp) / 100,
      strengths,
      weaknesses,
    };
  });

  scored.sort((a: any, b: any) => b.score - a.score);
  const topMatches = scored.slice(0, 10);

  return NextResponse.json({ matches: topMatches });
}
