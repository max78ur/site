import { motion } from 'framer-motion';
import { Truck, ClipboardList, Phone, DollarSign } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const steps = [
    {
        number: '01',
        icon: <Truck size={28} className="text-truckaxic-red"/>,
        title: 'Tell Us Your Equipment',
        desc: 'Share your trailer type, lanes, and rate expectations.',
    },
    {
        number: '02',
        icon: <ClipboardList size={28} className="text-truckaxic-red"/>,
        title: 'We Book the Loads',
        desc: 'Our dispatchers source and secure the best-paying freight for you.',
    },
    {
        number: '03',
        icon: <Phone size={28} className="text-truckaxic-red"/>,
        title: 'We Handle Brokers',
        desc: 'We negotiate rates and manage all broker communication.',
    },
    {
        number: '04',
        icon: <DollarSign size={28} className="text-truckaxic-red"/>,
        title: 'Get Paid Fast',
        desc: 'Haul, deliver, and get paid — we handle the paperwork.',
    },
];
export default function HowItWorks() {
    return (<section className="section bg-gray-50">
      <Container>
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold mb-6 border border-truckaxic-red/20">
            <span>Simple Process</span>
          </div>
          <h2>How TruckAxic Dispatch Works</h2>
          <p>
            From signup to your first load, we make getting dispatched simple
            and profitable.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (<motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-truckaxic-red text-white flex items-center justify-center mx-auto mb-6 font-bold text-lg shadow-red">
                {step.number}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>))}
        </div>
      </Container>
    </section>);
}
