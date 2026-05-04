import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import DisclaimerBanner from "@/components/shared/DisclaimerBanner";

const TRUST_SIGNALS = [
  { icon: "⚖️", text: "No legal advice — always consult an attorney" },
  { icon: "🆓", text: "Free to use" },
  { icon: "🌎", text: "Built for H1B, H4, and green card applicants" },
];

const STEPS = [
  { n: "1", label: "Answer 3–4 questions about your situation" },
  { n: "2", label: "Get a step-by-step roadmap with exact forms and fees" },
  { n: "3", label: "Download your personalized document checklist" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero — dark navy section */}
      <section className="relative overflow-hidden bg-[#0F172A] dark:bg-[#090e1a] text-white">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-teal-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 pt-24 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-teal-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Built for H1B holders, by an H1B holder
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Immigration is hard enough.{" "}
            <br className="hidden sm:block" />
            <span className="text-teal-400">Your paperwork shouldn&apos;t be.</span>
          </h1>

          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            ImmigrantIQ interviews you, reasons about your situation, and hands
            you a complete step-by-step game plan — the exact forms, fees, and
            documents you need.
          </p>

          <Link href="/intake">
            <Button
              size="lg"
              className="h-13 px-10 text-base bg-teal-500 hover:bg-teal-400 text-white border-0 shadow-xl shadow-teal-900/40 transition-colors"
            >
              Get My Immigration Roadmap →
            </Button>
          </Link>

          {/* Trust signals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
            {TRUST_SIGNALS.map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-xs text-white/50">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">How it works</p>
            <h2 className="text-3xl font-bold tracking-tight">Three steps to your roadmap</h2>
          </div>

          <div className="relative">
            <div className="absolute left-[19px] top-5 bottom-5 w-px bg-border hidden sm:block" />
            <div className="space-y-8">
              {STEPS.map((s) => (
                <div key={s.n} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 z-10">
                    {s.n}
                  </div>
                  <p className="text-base leading-relaxed pt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link href="/intake">
              <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                Start now — it&apos;s free →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-16 px-5 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Coverage</p>
          <h2 className="text-2xl font-bold tracking-tight mb-10">4 employment-based scenarios, covered in depth</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              { icon: "🔄", title: "H1B Extension" },
              { icon: "🏢", title: "H1B Transfer" },
              { icon: "💼", title: "H4 EAD" },
              { icon: "🌿", title: "Green Card (I-485)" },
            ].map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-medium text-xs">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1" />
      <DisclaimerBanner />
    </div>
  );
}
