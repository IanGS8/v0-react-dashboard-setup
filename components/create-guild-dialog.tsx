"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";

const FOCUS_AREAS = [
  { value: "matematica", label: "Matematica" },
  { value: "portugues", label: "Portugues" },
  { value: "historia", label: "Historia" },
  { value: "geografia", label: "Geografia" },
  { value: "fisica", label: "Fisica" },
  { value: "quimica", label: "Quimica" },
];

export function CreateGuildDialog({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [focusArea, setFocusArea] = useState("");

  async function handleCreate() {
    if (!name || !focusArea) return;
    setLoading(true);
    try {
      await fetch("/api/guilds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          focus_area: focusArea,
        }),
      });
      setOpen(false);
      setName("");
      setDescription("");
      setFocusArea("");
      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Guilda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Criar Nova Guilda</DialogTitle>
          <DialogDescription>
            Crie um grupo de estudos focado em uma materia especifica.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guild-name">Nome da Guilda</Label>
            <Input
              id="guild-name"
              placeholder="Ex: Mestres da Matematica"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guild-focus">Area de Foco</Label>
            <Select value={focusArea} onValueChange={setFocusArea}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma materia" />
              </SelectTrigger>
              <SelectContent>
                {FOCUS_AREAS.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guild-desc">Descricao (opcional)</Label>
            <Textarea
              id="guild-desc"
              placeholder="Descreva o objetivo do grupo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={loading || !name || !focusArea}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Criar Guilda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
