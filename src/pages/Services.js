import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Snowflake, Truck, Zap, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { services } from '@/data/services';
const icons = {
    'dry-van': <Package size={36} className="text-truckaxic-red"/>,
    reefer: <Snowflake size={36} className="text-blue-600"/>,
    flatbed: <Truck size={36} className="text-amber-600"/>,
    'power-only': <Zap size={36} className="text-purple-600"/>,
};
export default function ServicesPage() {
    return (<div className="relative">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Our Services
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-200 max-w-2xl mx-auto">
            Complete dispatch solutions for every trailer type.
          </motion.p>
        </div>
      </section>

      <section className="section bg-white">
        <Container>
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl font-bold">Complete Dispatch Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We handle every aspect of your dispatch operation — from sourcing
              loads to negotiating rates and managing broker communication.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (<motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-8">
                <div className="w-16 h-16 rounded-2xl {service.color} flex items-center justify-center mb-6">
                  {icons[service.id]}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((f) => (<li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-truckaxic-red"/>
                      {f}
                    </li>))}
                </ul>
                <Link to={service.route} className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-truckaxic-red bg-truckaxic-red/10 rounded-xl hover:bg-truckaxic-red hover:text-white transition-colors">
                  View Details <ArrowRight size={18} className="ml-2"/>
                </Link>
              </motion.div>))}
          </div>
        </Container>
      </section>

      <section className="section bg-black text-white border-y border-white/10">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Core Dispatch Services</h2>
              <ul className="space-y-4 text-lg">
                {[
            'Load booking and rate confirmation',
            'Rate negotiation with brokers and shippers',
            'Broker communication and check calls',
            '24/7 dispatch support and route planning',
            'Detention and lumper coordination',
            'Compliance and paperwork assistance',
        ].map((item, i) => (<li key={i} className="flex items-center gap-4 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-truckaxic-red flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </li>))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Get Dispatched Today</h3>
              <p className="text-gray-400 mb-6">
                Fill out our carrier signup form and a dispatch specialist will
                contact you within 24 hours.
              </p>
              <Link to="/carrier-signup" className="btn-ghost w-full">
                Sign Up as a Carrier
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>);
}
