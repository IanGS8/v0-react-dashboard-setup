import { Star } from "lucide-react";

function getXpForLevel(level: number) {
  return level * 100;
}

export function XpDisplay({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = getXpForLevel(level);
  const xpForPreviousLevel = getXpForLevel(level - 1);
  const xpInLevel = xp - xpForPreviousLevel;
  const xpNeeded = xpForCurrentLevel - xpForPreviousLevel;
  const progress = Math.min((xpInLevel / xpNeeded) * 100, 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {"Nivel "}
              {level}
            </p>
            <p className="text-xs text-muted-foreground">
              {xp} XP total
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {xpInLevel}/{xpNeeded} XP
        </p>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
