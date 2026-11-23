import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
export default function Terms() {
    return (<div className="relative">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Terms of Service
          </motion.h1>
        </div>
      </section>

      <section className="section bg-white">
        <Container className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
    </div>);
}
