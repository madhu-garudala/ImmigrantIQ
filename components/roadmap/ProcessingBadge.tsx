"use client";

import { classifyProcessingTime } from "@/lib/uscis";

interface ProcessingBadgeProps {
  time: string;
  weeks?: number;
}

export default function ProcessingBadge({ time, weeks = 0 }: ProcessingBadgeProps) {
  const level = weeks > 0 ? classifyProcessingTime(weeks) : "medium";

  const styles = {
    fast: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    slow: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${styles[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === "fast" ? "bg-emerald-500" : level === "medium" ? "bg-amber-500" : "bg-red-500"}`} />
      {time}
    </span>
  );
}
