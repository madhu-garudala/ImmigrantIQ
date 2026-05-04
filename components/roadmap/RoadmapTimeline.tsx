"use client";

import { useState } from "react";
import FormCard from "./FormCard";
import type { Roadmap } from "@/types";

interface RoadmapTimelineProps {
  roadmap: Roadmap;
}

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  const [activeStep, setActiveStep] = useState(1);

  const scrollToStep = (order: number) => {
    setActiveStep(order);
    const el = document.getElementById(`step-${order}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="flex gap-8 h-full">
      {/* Left sidebar — step navigator */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 sticky top-0 h-fit pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Steps</p>
        <nav className="space-y-1">
          {roadmap.steps.map((step) => (
            <button
              key={step.order}
              onClick={() => scrollToStep(step.order)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-2.5 ${
                activeStep === step.order
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${activeStep === step.order ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {step.order}
              </span>
              <span className="leading-tight">{step.formNumber}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Right — form cards with timeline connector */}
      <div className="flex-1 min-w-0 pb-12">
        <div className="space-y-0">
          {roadmap.steps.map((step, i) => (
            <div key={step.order} className="flex gap-4">
              {/* Timeline line + dot */}
              <div className="hidden sm:flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 mt-5 shrink-0 transition-colors ${activeStep === step.order ? "border-primary bg-primary" : "border-border bg-background"}`} />
                {i < roadmap.steps.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              {/* Card */}
              <div className="flex-1 pb-4">
                <FormCard
                  step={step}
                  isActive={activeStep === step.order}
                  onClick={() => setActiveStep(step.order)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Deadlines section */}
        {roadmap.importantDeadlines.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
              <span>⚠️</span> Important Deadlines & Reminders
            </h3>
            <ul className="space-y-2">
              {roadmap.importantDeadlines.map((d, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
