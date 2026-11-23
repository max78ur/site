import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { testimonials } from '@/data/testimonials';
export default function Testimonials() {
    return (<section className="section bg-white">
      <Container>
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold mb-6 border border-truckaxic-red/20">
            <span>Carrier Stories</span>
          </div>
          <h2>Trusted by Carriers Nationwide</h2>
          <p>
            Hear from owner-operators and fleet owners who dispatch with
            TruckAxic.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (<motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-8">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (<Star key={i} size={16} className={`${i <= t.rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'}`}/>))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-gray-200" onError={(e) => {
                const target = e.target;
                target.src =
                    'https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(t.name) +
                        '&background=b91c1c&color=fff';
            }}/>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">
                    {t.title} — {t.location}
                  </p>
                </div>
              </div>
            </motion.div>))}
        </div>
      </Container>
    </section>);
}
