import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { stats } from '@/data/testimonials';
export default function Statistics() {
    return (<section className="section bg-gray-50 border-y border-gray-100">
      <Container>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 text-center">
          {stats.map((stat) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-truckaxic-red font-extrabold text-4xl md:text-6xl mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>))}
        </div>
      </Container>
    </section>);
}
