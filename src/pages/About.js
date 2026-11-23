import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Globe, Headset } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import Statistics from '@/components/sections/Statistics';
export default function About() {
    return (<div className="relative">
      {/* Page hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            About TruckAxic
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-200 max-w-2xl mx-auto">
            Premium truck dispatch and logistics services built for American
            carriers.
          </motion.p>
        </div>
      </section>

      <section className="section bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (<div key={i} className="premium-card p-6">
                  <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mb-4">
                    {[<Truck />, <ShieldCheck />, <Globe />, <Headset />][i]}
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {['Nationwide Coverage', 'Fully Compliant', '24/7 Support', 'Dedicated Dispatcher'][i]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {['All 48 contiguous states covered.', 'FMCSA registered and USDOT compliant.', 'Round-the-clock dispatch support.', 'A single point of contact.'][i]}
                  </p>
                </div>))}
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
            <a href="/carrier-signup" className="btn-ghost">
              Become a Carrier
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Sales
            </a>
          </div>
        </Container>
      </section>
    </div>);
}
