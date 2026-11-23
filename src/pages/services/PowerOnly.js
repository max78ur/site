import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';
export default function PowerOnly() {
    return (<div className="relative">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Power Only Dispatch
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-200 max-w-2xl mx-auto">
            Tractor-only hauling with drop-and-hook loads for maximum uptime.
          </motion.p>
        </div>
      </section>

      <section className="section bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold border border-purple-100">
                <Zap size={18}/> Power Only
              </div>
              <h2 className="text-4xl font-bold">Power When You Need It</h2>
              <p className="text-gray-600 leading-relaxed">
                Power-only dispatch for carriers with trailers who need a
                tractor. We connect your power unit with drop-and-hook loads,
                minimizing deadhead miles and keeping your equipment earning.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Quick turnaround times and trailer pool management mean less
                waiting and more loaded miles for your power unit.
              </p>
              <ul className="space-y-3">
                {[
            'Drop-and-hook load booking',
            'Trailer pool management',
            'Minimal deadhead miles',
            'Quick turnaround',
        ].map((item, i) => (<li key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </li>))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Zap size={20}/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Power Only Fleet</h3>
                  <p className="text-sm text-gray-500">Tractor-only dispatch</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100">
                  <span className="text-sm text-gray-500">Trailer Types</span>
                  <span className="font-semibold text-gray-800">Drop-and-Hook</span>
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
                Get Power-Only Loads
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>);
}
