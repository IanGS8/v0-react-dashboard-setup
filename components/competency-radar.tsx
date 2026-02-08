"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export interface Competencies {
  matematica: number;
  portugues: number;
  historia: number;
  geografia: number;
  fisica: number;
  quimica: number;
}

const LABELS: Record<keyof Competencies, string> = {
  matematica: "Matematica",
  portugues: "Portugues",
  historia: "Historia",
  geografia: "Geografia",
  fisica: "Fisica",
  quimica: "Quimica",
};

export function CompetencyRadar({
  competencies,
}: {
  competencies: Competencies;
}) {
  const data = Object.entries(LABELS).map(([key, label]) => ({
    subject: label,
    value: competencies[key as keyof Competencies],
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <Radar
          name="Materias"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
