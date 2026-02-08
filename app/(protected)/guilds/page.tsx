"use client";

import useSWR from "swr";
import { GuildCard } from "@/components/guild-card";
import { CreateGuildDialog } from "@/components/create-guild-dialog";
import { Shield, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function GuildsPage() {
  const { data, isLoading, mutate } = useSWR("/api/guilds", fetcher);
  const guilds = data?.guilds || [];

  async function handleJoin(guildId: string) {
    await fetch("/api/guilds/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guild_id: guildId }),
    });
    mutate();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
            Guildas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Junte-se a grupos de estudo focados em materias especificas.
          </p>
        </div>
        <CreateGuildDialog onCreated={() => mutate()} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
        </div>
      ) : guilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 py-20 text-center">
          <Shield className="mb-3 h-12 w-12 text-primary/30" />
          <h3 className="text-lg font-semibold font-display text-foreground">
            Nenhuma guilda ainda
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Seja o primeiro a criar uma guilda e convide colegas para estudar
            juntos.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guilds.map((guild: any) => (
            <GuildCard key={guild.id} guild={guild} onJoin={handleJoin} />
          ))}
        </div>
      )}
    </div>
  );
}
