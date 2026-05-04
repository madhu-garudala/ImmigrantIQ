"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-lg mx-auto space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
