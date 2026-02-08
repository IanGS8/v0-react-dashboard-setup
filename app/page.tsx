import React from "react"
import Link from "next/link";
import {
  BookOpen,
  Users,
  Target,
  Zap,
  ArrowRight,
  Shield,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Construindo a Sabedoria
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Criar Conta</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex flex-col items-center gap-6 px-6 pb-20 pt-16 text-center lg:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Plataforma Gamificada de Aprendizagem
          </div>
          <h1 className="max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Aprenda mais, junto. Evolua suas notas.
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Descubra seus pontos fortes, encontre parceiros complementares e
            conquiste desafios em guildas. Transforme o estudo em uma jornada
            colaborativa.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Comece Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Ja tenho conta</Link>
            </Button>
          </div>
        </section>

        <section className="bg-card px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground">
              Como Funciona
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Uma experiencia completa para desenvolver suas habilidades
              academicas de forma colaborativa.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Target className="h-6 w-6" />}
                title="Radar de Materias"
                description="Visualize e acompanhe suas notas em 6 materias do ensino medio em um grafico radar interativo."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Match Inteligente"
                description="Encontre parceiros de estudo que complementam suas habilidades."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Guildas"
                description="Forme equipes e conquiste desafios coletivos para ganhar XP."
              />
              <FeatureCard
                icon={<Brain className="h-6 w-6" />}
                title="Sistema de XP"
                description="Ganhe experiencia, suba de nivel e acompanhe seu progresso."
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="max-w-lg text-balance font-display text-3xl font-bold text-foreground">
            Pronto para construir sabedoria?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Junte-se a milhares de estudantes que ja estao evoluindo suas
            materias de forma colaborativa.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        {"2026 Construindo a Sabedoria. Todos os direitos reservados."}
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border bg-background p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
