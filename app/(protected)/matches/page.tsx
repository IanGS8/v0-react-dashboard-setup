"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/match-card";
import { PendingMatches } from "@/components/pending-matches";
import { Search, Loader2, Sparkles, Users } from "lucide-react";

interface MatchUser {
  id: string;
  display_name: string;
  course: string | null;
  semester: number | null;
  xp: number;
  level: number;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  async function findMatches() {
    setSearching(true);
    try {
      const res = await fetch("/api/matches/find");
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
      }
      setSearched(true);
    } finally {
      setSearching(false);
    }
  }

  async function sendRequest(userId: string) {
    const match = matches.find((m) => m.id === userId);
    await fetch("/api/matches/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId: userId, score: match?.score ? Math.round(match.score * 100) : 0 }),
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
          Encontrar Parceiros
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encontre colegas com habilidades complementares para estudar juntos.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={findMatches}
              disabled={searching}
              className="gap-2"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar Matches
            </Button>
            {searched && (
              <span className="text-sm text-muted-foreground">
                {matches.length} resultado{matches.length !== 1 ? "s" : ""}{" "}
                encontrado{matches.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!searched && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 py-16 text-center">
              <Sparkles className="mb-3 h-10 w-10 text-primary/40" />
              <h3 className="text-lg font-semibold font-display text-foreground">
                Descubra seus matches
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Nosso algoritmo analisa suas notas e encontra colegas cujas
                materias fortes complementam as suas.
              </p>
            </div>
          )}

          {searched && matches.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 py-16 text-center">
              <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold text-foreground">
                Nenhum match encontrado
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Preencha suas notas no Dashboard para que possamos encontrar
                parceiros ideais para voce.
              </p>
            </div>
          )}

          {matches.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {matches.map((user) => (
                <MatchCard
                  key={user.id}
                  user={user}
                  onSendRequest={sendRequest}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-display text-foreground">
            Solicitacoes Recebidas
          </h2>
          <PendingMatches />
        </div>
      </div>
    </div>
  );
}
