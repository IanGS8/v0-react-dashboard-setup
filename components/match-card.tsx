"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, CheckCircle, Loader2 } from "lucide-react";

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

export function MatchCard({
  user,
  onSendRequest,
}: {
  user: MatchUser;
  onSendRequest: (userId: string) => Promise<void>;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      await onSendRequest(user.id);
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  const compatPercent = Math.round(user.score * 100);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-lg">
              {user.display_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <CardTitle className="text-base font-display">
                {user.display_name}
              </CardTitle>
              <CardDescription className="text-xs">
                {user.course || "Curso n/a"}
                {user.semester ? ` - ${user.semester}o sem.` : ""}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary font-mono text-xs"
          >
            <Zap className="mr-1 h-3 w-3" />
            {compatPercent}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="mb-1 font-medium text-muted-foreground">
              Pontos fortes
            </p>
            <div className="flex flex-wrap gap-1">
              {user.strengths.slice(0, 3).map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px]"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 font-medium text-muted-foreground">
              Pode melhorar
            </p>
            <div className="flex flex-wrap gap-1">
              {user.weaknesses.slice(0, 3).map((w) => (
                <Badge
                  key={w}
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px]"
                >
                  {w}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Nv. {user.level} &middot; {user.xp} XP
          </span>
          {sent ? (
            <Button size="sm" variant="ghost" disabled>
              <CheckCircle className="mr-1 h-3.5 w-3.5 text-emerald-500" />
              Enviado
            </Button>
          ) : (
            <Button size="sm" onClick={handleSend} disabled={sending}>
              {sending ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Users className="mr-1 h-3.5 w-3.5" />
              )}
              Conectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
