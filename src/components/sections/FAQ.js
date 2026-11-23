import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, Mail, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const faqs = [
    {
        q: 'What types of freight do you dispatch?',
        a: 'We dispatch dry van, refrigerated (reefer), flatbed, and power-only loads across all 48 states. Whether you haul general freight, temperature-sensitive goods, or oversized equipment, we have you covered.',
    },
    {
        q: 'How does TruckAxic find loads for my truck?',
        a: 'Our dispatch team works directly with brokers and shippers to source the best-paying loads for your equipment type and preferred lanes. We handle booking, rate confirmation, and paperwork.',
    },
    {
        q: 'Do you negotiate rates on my behalf?',
        a: 'Yes. Rate negotiation is a core part of our service. Our experienced dispatchers negotiate aggressively to maximize your revenue per loaded mile.',
    },
    {
        q: 'Is there 24/7 support?',
        a: 'Absolutely. Our dispatch desk is staffed around the clock, 365 days a year, to help with breakdowns, detentions, reroutes, and check calls.',
    },
    {
        q: 'Do I need my own authority to join?',
        a: 'Yes, carriers must have their own active MC authority and insurance. We help with compliance questions but require valid operating authority to dispatch loads.',
    },
    {
        q: 'How do I get started?',
        a: 'Fill out our carrier signup form or contact us directly. A dispatch specialist will review your equipment and get you moving with your first load.',
    },
];
export default function FAQ() {
    const [open, setOpen] = useState(0);
    return (<section className="section bg-gray-50">
      <Container>
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-truckaxic-red/10 text-truckaxic-red text-sm font-semibold mb-6 border border-truckaxic-red/20">
            <span>Frequently Asked</span>
          </div>
          <h2>Questions & Answers</h2>
          <p>
            Everything you need to know about dispatching with TruckAxic.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, i) => (<motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-6 text-left bg-transparent hover:bg-transparent">
                <motion.div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                    <Truck size={18} className="text-truckaxic-red"/>
                  </div>
                  <h3 className="font-semibold text-gray-800">{item.q}</h3>
                </motion.div>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="w-6 h-6 text-gray-400">
                  <ChevronDown size={20}/>
                </motion.div>
              </button>
              {open === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-gray-100 pt-6 px-6">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {item.a}
                  </p>
                </motion.div>)}
            </motion.div>))}
        </div>

        <div className="mt-16 lg:mt-24 bg-black rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Our dispatch specialists are ready to help you get on the road.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Phone size={20} className="text-truckaxic-red"/>
              <span>+1 (800) 555-0199</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Mail size={20} className="text-truckaxic-red"/>
              <span>support@truckaxic.com</span>
            </div>
            <LinkButton to="/contact">Contact Us</LinkButton>
          </div>
        </div>
      </Container>
    </section>);
}
function LinkButton({ to, children }) {
    return (<Link to={to} className="inline-flex items-center justify-center px-8 py-3 bg-truckaxic-red text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors">
      {children}
    </Link>);
}
