import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface NavbarProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function Navbar({ showBack, backHref = "/", backLabel = "Back" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link href={backHref} className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">IQ</div>
            <span className="font-semibold text-sm tracking-tight">ImmigrantIQ</span>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
