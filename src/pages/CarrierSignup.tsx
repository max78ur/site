import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/layout/PageHero';

const trailerTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Power Only', 'Step Deck'];

export default function CarrierSignup() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="For owner-operators and fleets"
        title="Your next chapter starts here."
        description="Join the TruckAxic fleet and get access to better loads, competitive rates, and 24/7 dispatch support."
        image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="section bg-gray-50">
        <Container>
          <div className="lg:grid-cols-2 lg:gap-12 grid gap-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold border border-truckaxic-red/20">
                <span>Join Our Fleet</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Become a TruckAxic Carrier
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We work with owner-operators and fleet owners across the
                United States. Get access to better loads, competitive rates,
                and 24/7 dispatch support.
              </p>
              <div className="space-y-4">
                {[
                  'Higher-paying loads across all 48 states',
      'Aggressive rate negotiation on your behalf',
      '24/7 dedicated dispatch support',
      'All trailer types: dry van, reefer, flatbed, power-only',
      'Fast onboarding and paperwork assistance',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-truckaxic-red/10 text-truckaxic-red flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <CarrierSignupForm />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="section bg-white border-t border-gray-100">
        <Container className="text-center">
          <h3 className="text-2xl font-bold mb-4">Questions?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Not ready to sign up? Speak with a dispatch specialist about your
            options.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+18005550199"
              className="btn-secondary"
            >
              <Phone size={18} className="mr-2" />
              Call Us
            </a>
            <a
              href="mailto:support@truckaxic.com"
              className="btn-secondary"
            >
              <Mail size={18} className="mr-2" />
              Email Us
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}

export function CarrierSignupForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('success');
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <div className="premium-card mx-auto max-w-md p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
              placeholder="John"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
            placeholder="john@trucking.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Company / Carrier Name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
            placeholder="ABC Trucking LLC"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            MC Number
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
            placeholder="MC123456"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Trailer Type
          </label>
          <select
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
          >
            <option value="" disabled>
              Select trailer type
            </option>
            {trailerTypes.map((trailerType) => (
              <option key={trailerType} value={trailerType}>
                {trailerType}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Number of Trucks
          </label>
          <select
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-truckaxic-red"
          >
            <option value="" disabled>
              Select fleet size
            </option>
            {['1-2', '3-5', '6-10', '11+'].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-200 text-truckaxic-red focus:ring-truckaxic-red"
          />
          <label htmlFor="terms" className="text-sm leading-relaxed text-gray-600">
            I agree to the{' '}
            <a href="/terms" className="text-truckaxic-red hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-truckaxic-red hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={status === 'success'}
        >
          {status === 'success' ? 'Application Sent!' : 'Apply to Become a Carrier'}
          <ArrowRight size={18} className="ml-2" />
        </button>
      </form>
      {status === 'success' && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-800">
          <span>✓</span>
          <span>
            Your application has been received. This is a frontend demo —
            backend submission is not yet connected. A dispatch specialist will
            contact you shortly.
          </span>
        </div>
      )}
    </div>
  );
}

