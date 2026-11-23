import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
export default function DryVan() {
    return (<div className="relative">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Dry Van Dispatch
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-200 max-w-2xl mx-auto">
            Reliable dry van dispatch for boxed and palletized freight across
            all 48 states.
          </motion.p>
        </div>
      </section>

      <section className="section bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-semibold border border-red-100">
                <Package size={18}/> Dry Van
              </div>
              <h2 className="text-4xl font-bold">General Freight, Handled Right</h2>
              <p className="text-gray-600 leading-relaxed">
                Dry van trailers are the backbone of American freight. We
                dispatch boxed, palletized, and general cargo loads for 53-foot
                dry van trailers — from short-haul regional runs to long-haul
                coast-to-coast lanes.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our dispatch team secures consistent, well-paying dry van loads
                so your trailers stay loaded and your revenue stays predictable.
              </p>
              <ul className="space-y-3">
                {[
            '53-foot dry van load booking',
            'Regional and OTR lanes',
            'Palletized and boxed freight',
            'Dedicated dispatcher',
        ].map((item, i) => (<li key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-truckaxic-red/10 text-truckaxic-red flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </li>))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Truck size={20}/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Dry Van Fleet</h3>
                  <p className="text-sm text-gray-500">Boxed &amp; palletized freight</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100">
                  <span className="text-sm text-gray-500">Trailer Types</span>
                  <span className="font-semibold text-gray-800">Dry Van 53'</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100">
                  <span className="text-sm text-gray-500">Coverage</span>
                  <span className="font-semibold text-gray-800">All 48 States</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100">
                  <span className="text-sm text-gray-500">Support</span>
                  <span className="font-semibold text-gray-800">24/7 Dispatch</span>
                </div>
              </div>
              <Link to="/contact" className="mt-8 block text-center px-6 py-3 bg-truckaxic-red text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors">
                Get Dry Van Loads
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>);
}
