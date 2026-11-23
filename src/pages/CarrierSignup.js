import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const trailerTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Power Only', 'Step Deck'];
export default function CarrierSignup() {
    const [status, setStatus] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus(null);
        setStatus('success');
        setTimeout(() => setStatus(null), 5000);
    };
    return (<div className="relative">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Carrier Signup
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-200 max-w-2xl mx-auto">
            Join the TruckAxic fleet and start hauling better loads today.
          </motion.p>
        </div>
      </section>

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
        ].map((item, i) => (<div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-truckaxic-red/10 text-truckaxic-red flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </div>))}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="relative">
              <div className="premium-card p-8 md:p-12 max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="John"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="Doe"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="john@trucking.com"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="+1 (555) 000-0000"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company / Carrier Name
                    </label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="ABC Trucking LLC"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MC Number
                    </label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="MC123456"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trailer Type
                    </label>
                    <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all bg-white">
                      <option value="" disabled>
                        Select trailer type
                      </option>
                      {trailerTypes.map((t) => (<option key={t} value={t}>
                          {t}
                        </option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Trucks
                    </label>
                    <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all bg-white">
                      <option value="" disabled>
                        Select fleet size
                      </option>
                      {['1-2', '3-5', '6-10', '11+'].map((size) => (<option key={size} value={size}>
                          {size}
                        </option>))}
                    </select>
                  </div>

                  <div className="flex items-start gap-3">
                    <input id="terms" type="checkbox" required className="w-4 h-4 rounded border-gray-200 text-truckaxic-red focus:ring-truckaxic-red"/>
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
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
                  <button type="submit" className="btn-primary w-full" disabled={status === 'success'}>
                    {status === 'success'
            ? 'Application Sent!'
            : 'Apply to Become a Carrier'}
                    <ArrowRight size={18} className="ml-2"/>
                  </button>
                </form>
                {status === 'success' && (<div className="mt-4 p-4 rounded-xl bg-green-50 text-green-800 text-sm flex items-center gap-3">
                    <span>✓</span>
                    <span>
                      Your application has been received. This is a frontend
                      demo — backend submission is not yet connected. A dispatch
                      specialist will contact you shortly.
                    </span>
                  </div>)}
              </div>
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
            <a href="tel:+18005550199" className="btn-secondary">
              <Phone size={18} className="mr-2"/>
              Call Us
            </a>
            <a href="mailto:support@truckaxic.com" className="btn-secondary">
              <Mail size={18} className="mr-2"/>
              Email Us
            </a>
          </div>
        </Container>
      </section>
    </div>);
}
