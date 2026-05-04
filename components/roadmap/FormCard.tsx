"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ProcessingBadge from "./ProcessingBadge";
import type { RoadmapStep } from "@/types";

interface FormCardProps {
  step: RoadmapStep;
  isActive: boolean;
  onClick: () => void;
}

export default function FormCard({ step, isActive, onClick }: FormCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isPlaceholder = step.fee === 0 && step.processingWeeks === 0;

  return (
    <div
      id={`step-${step.order}`}
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer ${
        isActive
          ? "border-primary bg-card shadow-lg shadow-primary/10"
          : "border-border bg-card/60 hover:border-primary/40 hover:bg-card"
      }`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {step.order}
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-primary mb-0.5">{step.formNumber}</div>
              <h3 className="font-semibold text-sm leading-snug">{step.title}</h3>
            </div>
          </div>
          {isActive && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 animate-pulse" />
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.formName}</p>

        <div className="flex flex-wrap gap-2">
          {!isPlaceholder && (
            <Badge variant="outline" className="text-xs font-medium border-border">
              ${step.fee.toLocaleString()} fee
            </Badge>
          )}
          <ProcessingBadge time={step.processingTime} weeks={step.processingWeeks} />
          <Badge variant="outline" className={`text-xs border-border ${step.whoFiles === "employer" ? "text-blue-600 dark:text-blue-400" : "text-primary"}`}>
            {step.whoFiles === "employer" ? "Employer files" : "You file"}
          </Badge>
        </div>
      </div>

      {/* Body — shown on active */}
      {isActive && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

          {step.bullets.length > 0 && (
            <ul className="space-y-2">
              {step.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {step.documents.length > 0 && (
            <div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Documents for this step ({step.documents.length})
              </button>
              {expanded && (
                <ul className="mt-3 space-y-1.5 pl-5">
                  {step.documents.map((doc, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary/60 shrink-0 mt-0.5">›</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <a
            href={step.uscisLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            View on USCIS.gov
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
