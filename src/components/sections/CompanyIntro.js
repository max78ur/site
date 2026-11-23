import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Globe, Headset } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const features = [
    {
        icon: <Truck size={32} className="text-truckaxic-red"/>,
        title: 'Nationwide Coverage',
        desc: 'We operate across all 48 contiguous states, keeping your fleet moving coast to coast.',
    },
    {
        icon: <ShieldCheck size={32} className="text-truckaxic-red"/>,
        title: 'Fully Compliant',
        text: 'FMCSA registered and USDOT compliant. Your authority is in safe hands.',
        desc: 'FMCSA registered and USDOT compliant. Your authority is in safe hands.',
    },
    {
        icon: <Globe size={32} className="text-truckaxic-red"/>,
        title: '24/7 Support',
        desc: 'Round-the-clock dispatch support so youre never alone on the road.',
    },
    {
        icon: <Headset size={32} className="text-truckaxic-red"/>,
        title: 'Dedicated Dispatcher',
        desc: 'A single point of contact who knows your operation and your goals.',
    },
];
export default function CompanyIntro() {
    return (<section className="section bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold mb-6 border border-truckaxic-red/20">
              <span>About TruckAxic</span>
            </div>
            <h2 className="mb-6">Built for American Carriers</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              TruckAxic was founded on a simple idea: dispatching should make
              carriers more money, not less. We combine industry-leading rate
              negotiation with hands-on load booking so owner-operators and
              fleet owners can focus on driving while we handle the rest.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              From our base in Houston, Texas, we coordinate freight movement
              across the entire United States. Whether you run one truck or a
              hundred, our dispatch team treats your business like our own.
            </p>
            <div className="flex gap-4">
              <button className="btn-ghost">Learn More</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-2 gap-6">
            {features.map((feature, i) => (<div key={i} className="premium-card p-6 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>))}
          </motion.div>
        </div>
      </Container>
    </section>);
}
