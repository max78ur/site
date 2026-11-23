import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
export default function ContactPage() {
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
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-200 max-w-2xl mx-auto">
            Get in touch with the TruckAxic dispatch team.
          </motion.p>
        </div>
      </section>

      <section className="section bg-white">
        <Container>
          <div className="lg:grid-cols-2 lg:gap-12 grid gap-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold border border-truckaxic-red/20">
                <span>Get in Touch</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Ready to Move Freight?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you are a carrier looking for dispatch or a shipper
                with freight to move, our team is ready to help.
              </p>
              <div className="space-y-6">
                {[
            {
                icon: <MapPin size={20}/>,
                title: 'Visit Us',
                text: '123 Logistics Way, Houston, TX 77002',
            },
            {
                icon: <Phone size={20}/>,
                title: 'Call Us',
                text: '+1 (800) 555-0199',
                href: 'tel:+18005550199',
            },
            {
                icon: <Mail size={20}/>,
                title: 'Email Us',
                text: 'support@truckaxic.com',
                href: 'mailto:support@truckaxic.com',
            },
            {
                icon: <Truck size={20}/>,
                title: 'Hours',
                text: 'Open 24/7 / 365 Days',
            },
        ].map((item, i) => (<a key={i} href={item.href} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-truckaxic-red/50 hover:bg-red-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0 text-truckaxic-red mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600">{item.text}</div>
                    </div>
                  </a>))}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="relative">
              <div className="premium-card p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="John Doe"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="john@trucking.com"/>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How can we help?
                    </label>
                    <textarea required rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all" placeholder="Tell us about your dispatch needs..."></textarea>
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
                    {status === 'success' ? 'Message Sent!' : 'Send Message'}
                    <ArrowRight size={18} className="ml-2"/>
                  </button>
                </form>
                {status === 'success' && (<div className="mt-4 p-4 rounded-xl bg-green-50 text-green-800 text-sm flex items-center gap-3">
                    <span>✓</span>
                    <span>
                      Your message has been sent. This is a frontend demo —
                      backend submission is not yet connected.
                    </span>
                  </div>)}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>);
}
