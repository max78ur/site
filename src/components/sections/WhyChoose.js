import { motion } from 'framer-motion';
import { ShieldCheck, DollarSign, Headset, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const reasons = [
    {
        icon: <DollarSign size={32} className="text-truckaxic-red"/>,
        title: 'Higher Rates',
        desc: 'Our negotiation team secures top-dollar rates for every load.',
    },
    {
        icon: <Truck size={32} className="text-truckaxic-red"/>,
        title: 'Less Deadhead',
        desc: 'Smart load matching minimizes empty miles and maximizes uptime.',
    },
    {
        icon: <ShieldCheck size={32} className="text-truckaxic-red"/>,
        title: 'Paperwork Handled',
        desc: 'We manage rate confirmations, invoices, and compliance documents.',
    },
    {
        icon: <Headset size={32} className="text-truckaxic-red"/>,
        title: '24/7 Dispatch',
        desc: 'A real person answers the phone, day or night.',
    },
];
export default function WhyChoose() {
    return (<section className="section bg-white">
      <Container>
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold mb-6 border border-truckaxic-red/20">
            <span>Why Carriers Choose Us</span>
          </div>
          <h2>Built Around Your Bottom Line</h2>
          <p>
            We are carrier-first. That means better rates, fewer empty miles,
            and a dispatch team that actually answers when you call.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (<motion.div key={reason.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>))}
        </div>
      </Container>
    </section>);
}
