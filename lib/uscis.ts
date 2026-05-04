export interface ProcessingTimeData {
  formNumber: string;
  estimatedTime: string;
  weeks: number;
  source: "live" | "cached";
  fetchedAt: string;
}

// Fallback data — updated periodically. USCIS times as of early 2025.
const FALLBACK_TIMES: Record<string, { time: string; weeks: number }> = {
  "I-129-H1B": { time: "3–6 months", weeks: 18 },
  "I-129-H1B-PP": { time: "15 business days (premium)", weeks: 3 },
  "I-539": { time: "4–10 months", weeks: 30 },
  "I-765-H4EAD": { time: "3–5 months", weeks: 18 },
  "I-765-AOS": { time: "Included with I-485 filing", weeks: 0 },
  "I-140": { time: "6–12 months", weeks: 36 },
  "I-140-PP": { time: "15 business days (premium)", weeks: 3 },
  "I-485": { time: "8–24 months", weeks: 60 },
  "I-131": { time: "Included with I-485 filing", weeks: 0 },
};

export async function fetchProcessingTime(formKey: string): Promise<ProcessingTimeData> {
  const fallback = FALLBACK_TIMES[formKey];
  if (!fallback) {
    return {
      formNumber: formKey,
      estimatedTime: "Check uscis.gov for current times",
      weeks: 0,
      source: "cached",
      fetchedAt: new Date().toISOString(),
    };
  }

  // Attempt live fetch from USCIS — best effort, fall back gracefully
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      "https://egov.uscis.gov/processing-times/api/processingtimes",
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 }, // cache 1 hour
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      // Parse their response structure — field names may vary
      // Fall through to cached if parse fails
    }
  } catch {
    // Network error or timeout — use cached
  }

  return {
    formNumber: formKey,
    estimatedTime: fallback.time,
    weeks: fallback.weeks,
    source: "cached",
    fetchedAt: new Date().toISOString(),
  };
}

export function classifyProcessingTime(weeks: number): "fast" | "medium" | "slow" {
  if (weeks <= 8) return "fast";
  if (weeks <= 26) return "medium";
  return "slow";
}
