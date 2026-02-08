"use client";

import { useState, useTransition } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Competencies } from "@/components/competency-radar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const COMPETENCY_LABELS: Record<keyof Competencies, string> = {
  comunicacao: "Comunicacao",
  pensamento_critico: "Pensamento Critico",
  resolucao_problemas: "Resolucao de Problemas",
  colaboracao: "Colaboracao",
  criatividade: "Criatividade",
  gestao_tempo: "Gestao do Tempo",
};

export function CompetencyEditor({
  competencies,
  userId,
}: {
  competencies: Competencies;
  userId: string;
}) {
  const [values, setValues] = useState<Competencies>(competencies);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("competencies")
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (!error) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {(Object.keys(COMPETENCY_LABELS) as (keyof Competencies)[]).map(
        (key) => (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{COMPETENCY_LABELS[key]}</Label>
              <span className="text-sm font-medium text-primary">
                {values[key]}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[values[key]]}
              onValueChange={([val]) =>
                setValues((prev) => ({ ...prev, [key]: val }))
              }
            />
          </div>
        ),
      )}
      <Button onClick={handleSave} disabled={isPending} className="mt-2">
        {isPending ? "Salvando..." : saved ? "Salvo!" : "Salvar Competencias"}
      </Button>
    </div>
  );
}
