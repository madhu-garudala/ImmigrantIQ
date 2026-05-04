"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Roadmap } from "@/types";

interface DownloadButtonProps {
  roadmap: Roadmap;
}

export default function DownloadButton({ roadmap }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });

      const margin = 50;
      const pageW = doc.internal.pageSize.getWidth();
      const maxW = pageW - margin * 2;
      let y = margin;

      const pageH = doc.internal.pageSize.getHeight();

      const checkPage = (neededHeight: number) => {
        if (y + neededHeight > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const addText = (text: string, size: number, isBold = false, color = [30, 30, 30] as [number, number, number]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxW) as string[];
        const lineH = size * 1.4;
        checkPage(lines.length * lineH);
        doc.text(lines, margin, y);
        y += lines.length * lineH;
      };

      const addSpace = (n = 12) => { y += n; };

      // Draw a checkbox [ ] using rect, then text to the right
      const addCheckItem = (text: string) => {
        const size = 10;
        const lineH = size * 1.4;
        const boxSize = 7;
        const textIndent = margin + boxSize + 6;
        const textMaxW = maxW - boxSize - 6;

        doc.setFontSize(size);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(text, textMaxW) as string[];
        checkPage(lines.length * lineH + 2);

        // Draw the checkbox rect
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.5);
        doc.rect(margin, y - boxSize + 1, boxSize, boxSize);

        // Draw the text beside it
        doc.text(lines, textIndent, y);
        y += lines.length * lineH + 2;
      };

      // Bullet point using a drawn circle
      const addBullet = (text: string, color = [80, 80, 80] as [number, number, number]) => {
        const size = 10;
        const lineH = size * 1.4;
        const dotX = margin + 3;
        const textIndent = margin + 12;
        const textMaxW = maxW - 12;

        doc.setFontSize(size);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, textMaxW) as string[];
        checkPage(lines.length * lineH + 4);

        doc.setFillColor(...color);
        doc.circle(dotX, y - 3, 1.5, "F");
        doc.text(lines, textIndent, y);
        y += lines.length * lineH + 4;
      };

      // Title
      addText("ImmigrantIQ", 9, false, [13, 148, 136]);
      addSpace(4);
      addText(roadmap.scenario, 22, true);
      addSpace(4);
      addText("Document Checklist", 14, false, [100, 100, 100]);
      addSpace(4);
      addText(`Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, 9, false, [150, 150, 150]);

      addSpace(20);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageW - margin, y);
      addSpace(20);

      // Summary
      addText("Overview", 13, true);
      addSpace(6);
      addText(roadmap.summary, 10, false, [80, 80, 80]);
      addSpace(20);

      // Document Groups
      addText("Documents to Gather", 13, true);
      addSpace(10);
      for (const group of roadmap.documentGroups) {
        addText(group.category.toUpperCase(), 8, true, [13, 148, 136]);
        addSpace(6);
        for (const item of group.items) {
          addCheckItem(item);
        }
        addSpace(10);
      }

      // Deadlines
      if (roadmap.importantDeadlines.length > 0) {
        addSpace(8);
        addText("Important Deadlines & Reminders", 13, true);
        addSpace(8);
        for (const d of roadmap.importantDeadlines) {
          addBullet(d);
        }
      }

      addSpace(20);
      // Disclaimer
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageW - margin, y);
      addSpace(12);
      addText(roadmap.disclaimer, 8, false, [150, 150, 150]);

      doc.save(`ImmigrantIQ-${roadmap.scenarioKey}-checklist.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="shadow-lg shadow-primary/20 gap-2"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Download PDF Checklist
        </>
      )}
    </Button>
  );
}
