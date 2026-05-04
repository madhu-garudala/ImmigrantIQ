"use client";

interface Option {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

interface QuestionCardProps {
  question: string;
  subtext?: string;
  options: Option[];
  onSelect: (id: string) => void;
}

export default function QuestionCard({ question, subtext, options, onSelect }: QuestionCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight leading-snug">{question}</h2>
        {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-accent/30 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <div className="flex items-start gap-3">
              {opt.icon && (
                <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">{opt.icon}</span>
              )}
              <div>
                <div className="font-medium text-sm">{opt.label}</div>
                {opt.description && (
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{opt.description}</div>
                )}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto mt-0.5 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
