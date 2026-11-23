import { motion } from 'framer-motion';
import { Truck, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const benefits = [
    {
        icon: <Truck size={30} className="text-truckaxic-red"/>,
        title: 'All Trailer Types',
        desc: 'Dry van, reefer, flatbed, and power-only dispatch under one roof.',
    },
    {
        icon: <DollarSign size={30} className="text-truckaxic-red"/>,
        title: 'Competitive Rates',
        desc: 'Aggressive negotiation gets you more revenue per loaded mile.',
    },
    {
        icon: <Clock size={30} className="text-truckaxic-red"/>,
        title: '24/7 Dispatch',
        desc: 'Always-available support for breakdowns, detentions, and reroutes.',
    },
    {
        icon: <ShieldCheck size={30} className="text-truckaxic-red"/>,
        title: 'Compliance Help',
        desc: 'We help with IFTA, permits, and FMCSA-related paperwork.',
    },
];
export default function CarrierBenefits() {
    return (<section className="section bg-black text-white">
      <Container>
        <div className="section-header text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/20 text-truckaxic-red-light text-sm font-semibold mb-6 border border-truckaxic-red/30">
            <span>Carrier Benefits</span>
          </div>
          <h2 className="text-white">Why Join the TruckAxic Fleet?</h2>
          <p className="text-gray-400">
            Partner with a dispatch team that treats your truck like their own.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (<motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-truckaxic-red/20 text-truckaxic-red-light flex items-center justify-center mb-6 backdrop-blur-sm">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>))}
        </div>
      </Container>
    </section>);
}
