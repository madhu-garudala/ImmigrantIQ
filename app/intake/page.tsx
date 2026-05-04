import IntakeWizard from "@/components/intake/IntakeWizard";
import Navbar from "@/components/shared/Navbar";
import DisclaimerBanner from "@/components/shared/DisclaimerBanner";

export default function IntakePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar showBack backHref="/" backLabel="Home" />
      <main className="flex-1 flex flex-col">
        <IntakeWizard />
      </main>
      <DisclaimerBanner />
    </div>
  );
}
