"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import DisclaimerBanner from "@/components/shared/DisclaimerBanner";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import DocumentChecklist from "@/components/checklist/DocumentChecklist";
import DownloadButton from "@/components/checklist/DownloadButton";
import FormExplainer from "@/components/chat/FormExplainer";
import type { Roadmap } from "@/types";

type Tab = "roadmap" | "checklist";

export default function RoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [unsupported, setUnsupported] = useState<{ note?: string } | null>(null);
  const [tab, setTab] = useState<Tab>("roadmap");

  useEffect(() => {
    const raw = sessionStorage.getItem("iq_roadmap");
    if (!raw) {
      router.push("/intake");
      return;
    }
    const data = JSON.parse(raw);
    if (data.unsupported) {
      setUnsupported(data);
    } else {
      setRoadmap(data as Roadmap);
    }
  }, [router]);

  if (unsupported) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar showBack backHref="/intake" backLabel="Back to Intake" />
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="max-w-lg text-center space-y-5">
            <div className="text-4xl">🤔</div>
            <h2 className="text-2xl font-bold tracking-tight">This situation is outside our scope</h2>
            <p className="text-muted-foreground leading-relaxed">
              {unsupported.note || "ImmigrantIQ currently covers H1B extension/transfer, H4 EAD, and I-485 green card cases. For other situations, we recommend consulting an immigration attorney."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/intake">
                <Button variant="outline">Try again</Button>
              </Link>
              <a href="https://www.ailalawyer.com/" target="_blank" rel="noopener noreferrer">
                <Button>Find an immigration attorney →</Button>
              </a>
            </div>
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-sm">Loading your roadmap...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar showBack backHref="/intake" backLabel="Back" />

      {/* Page header */}
      <div className="border-b border-border bg-background">
        <div className="max-w-5xl mx-auto px-5 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Your Personalized Roadmap</p>
              <h1 className="text-2xl font-bold tracking-tight">{roadmap.scenario}</h1>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">{roadmap.summary}</p>
            </div>
            <div className="shrink-0">
              <DownloadButton roadmap={roadmap} />
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mt-6 border-b border-border">
            {(["roadmap", "checklist"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative ${
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "roadmap" ? "📋 Roadmap" : "✅ Checklist"}
                {tab === t && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-6">
        {tab === "roadmap" && <RoadmapTimeline roadmap={roadmap} />}

        {tab === "checklist" && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Document Checklist</h2>
              <p className="text-sm text-muted-foreground">Check off documents as you gather them. Use the download button above to save a PDF copy.</p>
            </div>
            <DocumentChecklist documentGroups={roadmap.documentGroups} />
          </div>
        )}
      </main>

      <DisclaimerBanner />

      {/* Floating form explainer */}
      <FormExplainer />
    </div>
  );
}
