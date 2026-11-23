import { motion } from 'framer-motion';
import { Truck, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';

const benefits = [
  {
    icon: <Truck size={30} className="text-truckaxic-red" />,
    title: 'All Trailer Types',
    desc: 'Dry van, reefer, flatbed, and power-only dispatch under one roof.',
  },
  {
    icon: <DollarSign size={30} className="text-truckaxic-red" />,
    title: 'Competitive Rates',
    desc: 'Aggressive negotiation gets you more revenue per loaded mile.',
  },
  {
    icon: <Clock size={30} className="text-truckaxic-red" />,
    title: '24/7 Dispatch',
    desc: 'Always-available support for breakdowns, detentions, and reroutes.',
  },
  {
    icon: <ShieldCheck size={30} className="text-truckaxic-red" />,
    title: 'Compliance Help',
    desc: 'We help with IFTA, permits, and FMCSA-related paperwork.',
  },
];

export default function CarrierBenefits() {
  return (
    <section className="section benefits-section">
      <Container>
        <div className="section-heading benefits-heading">
          <div>
            <span className="section-kicker">05 / Carrier benefits</span>
            <h2 className="section-title">Why Join the TruckAxic Fleet?</h2>
          </div>
          <p className="section-lede">
            Partner with a dispatch team that treats your truck like their own.
          </p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="benefit-item"
            >
              <span className="benefit-number">0{index + 1}</span>
              <div className="benefit-icon">
                {benefit.icon}
              </div>
              <div>
                <h3>{benefit.title}</h3>
                <p>
                {benefit.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
