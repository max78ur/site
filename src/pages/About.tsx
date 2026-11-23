import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Globe, Headset } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import Statistics from '@/components/sections/Statistics';
import { PageHero } from '@/components/layout/PageHero';

const aboutFeatures = [
  {
    icon: <Truck className="text-truckaxic-red" />,
    title: 'Nationwide Coverage',
    description: 'All 48 contiguous states covered.',
  },
  {
    icon: <ShieldCheck className="text-truckaxic-red" />,
    title: 'Fully Compliant',
    description: 'FMCSA registered and USDOT compliant.',
  },
  {
    icon: <Globe className="text-truckaxic-red" />,
    title: '24/7 Support',
    description: 'Round-the-clock dispatch support.',
  },
  {
    icon: <Headset className="text-truckaxic-red" />,
    title: 'Dedicated Dispatcher',
    description: 'A single point of contact for your operation.',
  },
];

export default function About() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="The people behind every mile"
        title="Built for American carriers."
        description="Premium truck dispatch and logistics services built around the people who keep freight moving."
        image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="section bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold border border-truckaxic-red/20">
                <span>Our Story</span>
              </div>
              <h2 className="text-4xl font-bold">Built for American Carriers</h2>
              <p className="text-gray-600 leading-relaxed">
                TruckAxic was founded on a simple idea: dispatching should make
                carriers more money, not less. We combine industry-leading rate
                negotiation with hands-on load booking so owner-operators and
                fleet owners can focus on driving while we handle the rest.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From our base in Houston, Texas, we coordinate freight movement
                across the entire United States. Whether you run one truck or a
                hundred, our dispatch team treats your business like our own.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              {aboutFeatures.map((feature) => (
                  <div key={feature.title} className="premium-card p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
                      {feature.icon}
                  </div>
                    <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm leading-6 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      <Statistics />

      <section className="section bg-gray-50">
        <Container className="text-center">
          <h2 className="text-4xl font-bold mb-4">Our Commitment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            We are powered by a simple belief: every mile should count. That is
            why we work relentlessly to keep your trucks loaded, your rates
            competitive, and your paperwork handled.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/carrier-signup" className="btn-primary">
              Become a Carrier
            </Link>
            <Link to="/contact" className="btn-ghost">
              Contact Sales
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
