import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Snowflake, Truck, Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { services } from '@/data/services';
const icons = {
    'dry-van': <Package size={32} className="text-truckaxic-red"/>,
    reefer: <Snowflake size={32} className="text-blue-600"/>,
    flatbed: <Truck size={32} className="text-amber-600"/>,
    'power-only': <Zap size={32} className="text-purple-600"/>,
};
export default function ServicesSection() {
    return (<section className="section bg-gray-50">
      <Container>
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold mb-6 border border-truckaxic-red/20">
            <span>Our Capabilities</span>
          </div>
          <h2>Complete Dispatch Solutions</h2>
          <p>
            We handle every aspect of your dispatch operation — from sourcing
            loads to negotiating rates and managing broker communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (<motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group premium-card p-8 hover:border-truckaxic-red/50">
              <div className="w-14 h-14 rounded-2xl {service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <Link to={service.route} className="inline-flex items-center justify-center w-auto px-6 py-3 text-sm font-semibold text-truckaxic-red bg-truckaxic-red/10 rounded-xl hover:bg-truckaxic-red hover:text-white transition-colors">
                View Details <span className="ml-1">→</span>
              </Link>
            </motion.div>))}
        </div>
      </Container>
    </section>);
}
