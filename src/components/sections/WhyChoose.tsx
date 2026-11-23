import { motion } from 'framer-motion';
import { ShieldCheck, DollarSign, Headset, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';

const reasons = [
  {
    icon: <DollarSign size={32} className="text-truckaxic-red" />,
    title: 'Higher Rates',
    desc: 'Our negotiation team secures top-dollar rates for every load.',
  },
  {
    icon: <Truck size={32} className="text-truckaxic-red" />,
    title: 'Less Deadhead',
    desc: 'Smart load matching minimizes empty miles and maximizes uptime.',
  },
  {
    icon: <ShieldCheck size={32} className="text-truckaxic-red" />,
    title: 'Paperwork Handled',
    desc: 'We manage rate confirmations, invoices, and compliance documents.',
  },
  {
    icon: <Headset size={32} className="text-truckaxic-red" />,
    title: '24/7 Dispatch',
    desc: 'A real person answers the phone, day or night.',
  },
];

export default function WhyChoose() {
  return (
    <section className="section why-section">
      <Container>
        <div className="why-layout">
          <div className="section-heading why-heading">
            <span className="section-kicker">03 / A better dispatch partner</span>
            <h2 className="section-title">Built around your bottom line.</h2>
            <p className="section-lede">
              We are carrier-first. That means better rates, fewer empty miles,
              and a dispatch team that actually answers when you call.
            </p>
          </div>
          <div className="why-list">
            {reasons.map((reason, index) => (
              <motion.article
                key={reason.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="why-item"
              >
                <span className="why-item-number">0{index + 1}</span>
                <div className="why-item-icon">{reason.icon}</div>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
