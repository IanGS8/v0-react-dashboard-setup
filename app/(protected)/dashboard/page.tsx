import React from "react"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompetencyRadar } from "@/components/competency-radar";
import { XpDisplay } from "@/components/xp-display";
import { CompetencyEditor } from "@/components/competency-editor";
import { Target, TrendingUp, Users, Shield } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: competencies } = await supabase
    .from("competencies")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { count: matchCount } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`)
    .eq("status", "accepted");

  const { count: guildCount } = await supabase
    .from("guild_members")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const comp = competencies ?? {
    matematica: 5,
    portugues: 5,
    historia: 5,
    geografia: 5,
    fisica: 5,
    quimica: 5,
  };

  const avgScore = Math.round(
    (comp.matematica +
      comp.portugues +
      comp.historia +
      comp.geografia +
      comp.fisica +
      comp.quimica) /
      6,
  );

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {"Ola, "}
          {profile?.display_name || "Estudante"}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe seu progresso e evolua suas notas.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Nivel"
          value={String(profile?.level ?? 1)}
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Media Geral"
          value={`${avgScore}/10`}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Matches"
          value={String(matchCount ?? 0)}
        />
        <StatCard
          icon={<Shield className="h-4 w-4" />}
          label="Guildas"
          value={String(guildCount ?? 0)}
        />
      </div>

      {/* XP Bar */}
      <Card>
        <CardContent className="pt-6">
          <XpDisplay xp={profile?.xp ?? 0} level={profile?.level ?? 1} />
        </CardContent>
      </Card>

      {/* Radar + Editor */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">
              Radar de Materias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompetencyRadar competencies={comp} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">
              Avaliar Materias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompetencyEditor competencies={comp} userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
