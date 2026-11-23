import { motion } from 'framer-motion';
import { Truck, ClipboardList, Phone, DollarSign } from 'lucide-react';
import { Container } from '@/components/layout/Container';

const steps = [
  {
    number: '01',
    icon: <Truck size={28} className="text-truckaxic-red" />,
    title: 'Tell Us Your Equipment',
    desc: 'Share your trailer type, lanes, and rate expectations.',
  },
  {
    number: '02',
    icon: <ClipboardList size={28} className="text-truckaxic-red" />,
    title: 'We Book the Loads',
    desc: 'Our dispatchers source and secure the best-paying freight for you.',
  },
  {
    number: '03',
    icon: <Phone size={28} className="text-truckaxic-red" />,
    title: 'We Handle Brokers',
    desc: 'We negotiate rates and manage all broker communication.',
  },
  {
    number: '04',
    icon: <DollarSign size={28} className="text-truckaxic-red" />,
    title: 'Get Paid Fast',
    desc: 'Haul, deliver, and get paid — we handle the paperwork.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section process-section">
      <Container>
        <div className="section-heading process-heading">
          <div>
            <span className="section-kicker">04 / Simple process</span>
            <h2 className="section-title">How TruckAxic Dispatch Works</h2>
          </div>
          <p className="section-lede">
            From signup to your first load, we make getting dispatched simple
            and profitable.
          </p>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="process-step"
            >
              <span className="process-step-number">{step.number}</span>
              <div className="process-step-icon">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>
                {step.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
