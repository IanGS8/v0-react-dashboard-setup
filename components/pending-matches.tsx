"use client";

import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const fetcher = async (url: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("matches")
    .select(
      "id, user_id, status, compatibility_score, profiles!matches_user_id_fkey(display_name, course, semester)"
    )
    .eq("partner_id", user.id)
    .eq("status", "pending");

  return data || [];
};

export function PendingMatches() {
  const { data: pending, mutate } = useSWR("pending-matches", fetcher);
  const [loading, setLoading] = useState<string | null>(null);

  async function respond(matchId: string, accept: boolean) {
    setLoading(matchId);
    try {
      await fetch("/api/matches/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: matchId,
          accept,
        }),
      });
      mutate();
    } finally {
      setLoading(null);
    }
  }

  if (!pending || pending.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Inbox className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Nenhuma solicitacao pendente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((match: any) => {
        const profile = match.profiles;
        return (
          <Card key={match.id} className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {profile?.display_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      {profile?.display_name || "Usuario"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {profile?.course || ""}
                      {profile?.semester
                        ? ` - ${profile.semester}o sem.`
                        : ""}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Pendente
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end gap-2 pt-0">
              {loading === match.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => respond(match.id, false)}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Recusar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => respond(match.id, true)}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Aceitar
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
