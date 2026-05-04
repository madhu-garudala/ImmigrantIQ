"use client";

import { useState } from "react";
import type { DocumentGroup } from "@/types";

interface DocumentChecklistProps {
  documentGroups: DocumentGroup[];
}

export default function DocumentChecklist({ documentGroups }: DocumentChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const allItems = documentGroups.flatMap((g) => g.items);
  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = allItems.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header + progress */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-semibold">{doneCount}/{total} documents ready</span>
        </div>
        <span className="text-sm text-primary font-semibold">{pct}%</span>
      </div>
      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Groups */}
      {documentGroups.map((group) => (
        <div key={group.category}>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mt-5">
            {group.category}
          </h4>
          <ul className="space-y-2">
            {group.items.map((item) => {
              const key = `${group.category}::${item}`;
              const isChecked = !!checked[key];
              return (
                <li
                  key={key}
                  onClick={() => toggle(key)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    isChecked
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40 group-hover:border-primary"
                  }`}>
                    {isChecked && (
                      <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm leading-snug transition-colors ${isChecked ? "line-through text-muted-foreground" : "text-foreground/90"}`}>
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {doneCount === total && total > 0 && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 py-4 px-5 text-center">
          <p className="text-sm font-semibold text-primary">All documents ready! 🎉</p>
          <p className="text-xs text-muted-foreground mt-1">Download your checklist before you head to the attorney.</p>
        </div>
      )}
    </div>
  );
}
