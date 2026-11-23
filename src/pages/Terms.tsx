import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/layout/PageHero';

export default function Terms() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="TruckAxic Logistics Inc."
        title="Terms of Service"
        image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="section bg-white">
        <Container className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p
              role="note"
              className="border-l-4 border-primary-red bg-red-50 p-4 text-sm leading-relaxed text-gray-700"
            >
              Attorney review required: this page currently displays existing
              fallback text. Confirm that it reflects current business terms
              and has been reviewed before relying on it.
            </p>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Last updated: November 2026
            </p>
            <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to TruckAxic. These terms govern your use of our website
              and services. By using our site or submitting our forms, you
              agree to these terms.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Frontend Demo Notice</h3>
            <p className="text-gray-600 leading-relaxed">
              This website is a frontend demonstration. Form submissions
              (contact and carrier signup) are handled on the frontend only and
              are not yet connected to a backend. No data is stored or
              transmitted to a server.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Use of Services</h3>
            <p className="text-gray-600 leading-relaxed">
              You agree to provide accurate information when completing our
              forms. TruckAxic reserves the right to reject incomplete or
              inaccurate carrier applications.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h3>
            <p className="text-gray-600 leading-relaxed">
              TruckAxic is not liable for any damages arising from the use of
              this website or reliance on information provided herein.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-600 leading-relaxed">
              For questions about these terms, contact us at
              support@truckaxic.com.
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
