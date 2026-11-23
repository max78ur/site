import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Snowflake, Truck, Zap, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { services } from '@/data/services';
import { PageHero } from '@/components/layout/PageHero';

const icons: Record<string, React.ReactNode> = {
  'dry-van': <Package size={36} className="text-truckaxic-red" />,
  reefer: <Snowflake size={36} className="text-truckaxic-red" />,
  flatbed: <Truck size={36} className="text-truckaxic-red" />,
  'power-only': <Zap size={36} className="text-truckaxic-red" />,
};

export default function ServicesPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Nationwide dispatch solutions"
        title="The right support for every haul."
        description="Complete dispatch solutions for every trailer type, with load sourcing, rate negotiation, and steady support from pickup to delivery."
        image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2200&q=85"
        action={{ label: 'Talk to dispatch', to: '/contact' }}
      />

      <section className="section bg-white">
        <Container>
          <div className="section-header text-center mb-16">
            <h2 className="text-4xl font-bold">Choose your equipment.</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We handle every aspect of your dispatch operation — from sourcing
              loads to negotiating rates and managing broker communication.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="premium-card group overflow-hidden"
              >
                <div className="service-image h-56">
                  <img src={service.image} alt={service.imageAlt} loading="lazy" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
                    {service.subtitle}
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4f4f2]">
                    {icons[service.id]}
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{service.title}</h3>
                  <p className="mb-6 min-h-[4.5rem] text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>
                  <ul className="mb-6 space-y-2 border-t border-gray-100 pt-4">
                    {service.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-truckaxic-red" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={service.route}
                    className="inline-flex items-center gap-2 text-sm font-bold text-truckaxic-red transition-all group-hover:gap-3"
                  >
                    View details <ArrowRight size={17} />
                  </Link>
                </div>
              </motion.div>
            ))}
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
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-truckaxic-red flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </li>
                ))}
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
    </div>
  );
}
