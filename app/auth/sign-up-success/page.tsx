import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Mail } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              Construindo a Sabedoria
            </span>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Conta Criada!
              </CardTitle>
              <CardDescription>
                Verifique seu email para confirmar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Enviamos um link de confirmacao para o seu email. Clique no link
                para ativar sua conta e comecar a usar a plataforma.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
