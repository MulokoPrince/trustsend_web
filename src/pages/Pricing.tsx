import { Nav } from "../components/Nav";
import { AskAssistant } from "../components/AskAssistant";
import { CookieConsent } from "../components/CookieConsent";
import { PricingPlans } from "../components/PricingPlans";
import { FAQ } from "../components/FAQ";
import { CTABanner } from "../components/CTABanner";
import { Footer } from "../components/Footer";

export function Pricing() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main>
        <PricingPlans />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
      <AskAssistant />
      <CookieConsent />
    </div>
  );
}
