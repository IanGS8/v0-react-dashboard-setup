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
import { Users, LogIn, CheckCircle, Loader2, Shield } from "lucide-react";

interface Guild {
  id: string;
  name: string;
  description: string | null;
  focus_area: string;
  member_count: number;
  is_member: boolean;
  owner_id: string;
}

export function GuildCard({
  guild,
  onJoin,
}: {
  guild: Guild;
  onJoin: (guildId: string) => Promise<void>;
}) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(guild.is_member);

  async function handleJoin() {
    setJoining(true);
    try {
      await onJoin(guild.id);
      setJoined(true);
    } finally {
      setJoining(false);
    }
  }

  const focusColors: Record<string, string> = {
    matematica: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    portugues: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
    historia: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    geografia: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    fisica: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
    quimica: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30",
  };

  const focusLabels: Record<string, string> = {
    matematica: "Matematica",
    portugues: "Portugues",
    historia: "Historia",
    geografia: "Geografia",
    fisica: "Fisica",
    quimica: "Quimica",
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-display">
                {guild.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {guild.member_count} membro{guild.member_count !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className={focusColors[guild.focus_area] || ""}
          >
            {focusLabels[guild.focus_area] || guild.focus_area}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {guild.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {guild.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {guild.member_count} membro{guild.member_count !== 1 ? "s" : ""}
          </div>
          {joined ? (
            <Button size="sm" variant="ghost" disabled>
              <CheckCircle className="mr-1 h-3.5 w-3.5 text-emerald-500" />
              Membro
            </Button>
          ) : (
            <Button size="sm" onClick={handleJoin} disabled={joining}>
              {joining ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogIn className="mr-1 h-3.5 w-3.5" />
              )}
              Entrar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
