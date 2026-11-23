import { PageHero } from '@/components/layout/PageHero';
import HowItWorksSection from '@/components/sections/HowItWorks';

export default function HowItWorks() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="TruckAxic Dispatch"
        title="How It Works"
        description="From signup to your first load, see how the TruckAxic dispatch process works."
        image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2200&q=85"
      />
      <HowItWorksSection />
    </div>
  );
}
