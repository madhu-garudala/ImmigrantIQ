"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import type { IntakeAnswers } from "@/types";

type Step =
  | "visa_status"
  | "h1b_goal"
  | "h4_i140"
  | "green_card_i140"
  | "green_card_pd"
  | "generating";

interface StepState {
  step: Step;
  answers: Partial<IntakeAnswers>;
  direction: number;
}

const TOTAL_STEPS: Record<Step, number> = {
  visa_status: 1,
  h1b_goal: 2,
  h4_i140: 2,
  green_card_i140: 2,
  green_card_pd: 3,
  generating: 4,
};

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export default function IntakeWizard() {
  const router = useRouter();
  const [state, setState] = useState<StepState>({
    step: "visa_status",
    answers: {},
    direction: 1,
  });
  const [error, setError] = useState<string | null>(null);

  const go = (next: Step, newAnswers: Partial<IntakeAnswers>, dir = 1) => {
    setState({ step: next, answers: { ...state.answers, ...newAnswers }, direction: dir });
  };

  const handleVisaStatus = (id: string) => {
    if (id === "h1b") go("h1b_goal", { visaStatus: "H1B" });
    else if (id === "h4") go("h4_i140", { visaStatus: "H4" });
    else if (id === "green_card") go("green_card_i140", { visaStatus: "Other / Green Card path" });
    else {
      // Unsupported — go straight to generating with unsupported flag
      submitIntake({ visaStatus: id, goal: "other" });
    }
  };

  const submitIntake = async (finalAnswers: Partial<IntakeAnswers>) => {
    const answers = { ...state.answers, ...finalAnswers } as IntakeAnswers;
    setState((s) => ({ ...s, step: "generating", direction: 1 }));
    setError(null);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      if (data.unsupported) {
        sessionStorage.setItem("iq_roadmap", JSON.stringify({ unsupported: true, note: data.note }));
      } else {
        sessionStorage.setItem("iq_roadmap", JSON.stringify(data.roadmap));
      }

      router.push("/roadmap");
    } catch {
      setError("Something went wrong. Please try again.");
      setState((s) => ({ ...s, step: "visa_status" }));
    }
  };

  const maxSteps = 4;

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-5 py-12">
      <div className="w-full max-w-lg mb-10">
        <ProgressBar current={TOTAL_STEPS[state.step]} total={maxSteps} />
      </div>

      <AnimatePresence mode="wait" custom={state.direction}>
        <motion.div
          key={state.step}
          custom={state.direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="w-full"
        >
          {state.step === "visa_status" && (
            <QuestionCard
              question="What is your current US visa status?"
              subtext="Select the option that best describes you right now."
              options={[
                { id: "h1b", label: "H1B — Specialty Occupation", description: "You work for a US employer on an H1B visa", icon: "🏢" },
                { id: "h4", label: "H4 — Dependent of H1B holder", description: "Your spouse or parent holds an H1B visa", icon: "👨‍👩‍👧" },
                { id: "green_card", label: "My employer filed an I-140 for me", description: "You're on any visa but pursuing a green card", icon: "🌿" },
                { id: "other", label: "Something else", description: "F1, OPT, L1, or other status", icon: "🔍" },
              ]}
              onSelect={handleVisaStatus}
            />
          )}

          {state.step === "h1b_goal" && (
            <QuestionCard
              question="What do you need to do with your H1B?"
              subtext="Choose the situation that applies."
              options={[
                { id: "extend", label: "Extend with my current employer", description: "Your H1B is expiring and you want to stay at the same company", icon: "🔄" },
                { id: "transfer", label: "Transfer to a new employer", description: "You have a new job offer and want to move your H1B", icon: "🚀" },
              ]}
              onSelect={(id) => {
                if (id === "extend") submitIntake({ goal: "Extend H1B with current employer" });
                else submitIntake({ goal: "Transfer H1B to new employer" });
              }}
            />
          )}

          {state.step === "h4_i140" && (
            <QuestionCard
              question="Does your spouse have an approved I-140?"
              subtext="The I-140 is the immigrant petition filed by your spouse's employer. H4 EAD requires an approved I-140."
              options={[
                { id: "yes", label: "Yes — approved I-140", description: "Your spouse has an approval notice (I-797) for their I-140", icon: "✅" },
                { id: "no", label: "No or not sure", description: "The I-140 hasn't been filed, is pending, or you're not sure", icon: "❓" },
              ]}
              onSelect={(id) => {
                if (id === "yes") submitIntake({ goal: "Apply for H4 EAD work authorization", hasI140: true });
                else submitIntake({ goal: "H4 EAD — no I-140 yet", hasI140: false });
              }}
            />
          )}

          {state.step === "green_card_i140" && (
            <QuestionCard
              question="What is the status of your I-140 petition?"
              subtext="Your employer files the I-140 to establish your green card eligibility."
              options={[
                { id: "approved", label: "Approved", description: "You have an I-797 approval notice", icon: "✅" },
                { id: "pending", label: "Pending / Filed but not approved", description: "It's been filed but not yet decided", icon: "⏳" },
                { id: "not_filed", label: "Not filed yet", description: "Still in the PERM or early stages", icon: "📋" },
              ]}
              onSelect={(id) => {
                if (id === "approved") go("green_card_pd", { goal: "Apply for green card — I-485 adjustment of status", hasI140: true });
                else submitIntake({ goal: `Green card — I-140 status: ${id}`, hasI140: false });
              }}
            />
          )}

          {state.step === "green_card_pd" && (
            <QuestionCard
              question="Is your priority date currently listed as 'C' (Current) in the Visa Bulletin?"
              subtext="Check the monthly Visa Bulletin at travel.state.gov. Find your EB category and country of birth row."
              options={[
                { id: "yes", label: "Yes — my date is current", description: "The Visa Bulletin shows 'C' or my date is before the cutoff", icon: "🟢" },
                { id: "no", label: "No — I'm waiting for my date to become current", description: "My priority date hasn't been reached yet", icon: "🟡" },
                { id: "unsure", label: "I'm not sure how to check", description: "I need help understanding the Visa Bulletin", icon: "❓" },
              ]}
              onSelect={(id) => {
                submitIntake({ goal: "Apply for green card — I-485 adjustment of status", hasI140: true, priorityDateCurrent: id === "yes" });
              }}
            />
          )}

          {state.step === "generating" && (
            <div className="flex flex-col items-center gap-6 text-center py-8">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🗺️</div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Building your roadmap...</h3>
                <p className="text-sm text-muted-foreground">Analyzing your situation and preparing your personalized plan</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="mt-6 text-sm text-destructive text-center">{error}</div>
      )}

      {state.step !== "visa_status" && state.step !== "generating" && (
        <button
          onClick={() => setState((s) => ({ ...s, step: "visa_status", direction: -1 }))}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Start over
        </button>
      )}
    </div>
  );
}
