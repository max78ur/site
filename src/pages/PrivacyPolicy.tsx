import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
export default function PrivacyPolicy() {
    return (<div className="relative">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%, rgba(185,28,28,0.15), transparent 55%)]" style={{ pointerEvents: 'none' }}/>
        <div className="relative z-10 container-premium text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Privacy Policy
          </motion.h1>
        </div>
      </section>

      <section className="section bg-white">
        <Container className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Last updated: November 2026
            </p>
            <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              TruckAxic Logistics Inc. ("we," "us," or "our") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, and safeguard information you provide when you
              visit our website or submit our carrier signup or contact forms.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h3>
            <p className="text-gray-600 leading-relaxed">
              We may collect personal information such as your name, email
              address, phone number, company name, MC number, and other details
              you voluntarily submit through our contact or carrier signup
              forms.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h3>
            <p className="text-gray-600 leading-relaxed">
              We use the information you provide to respond to your inquiries,
              evaluate carrier applications, and provide dispatch and logistics
              services. We do not sell your personal information to third
              parties.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy, contact us at
              support@truckaxic.com.
            </p>
          </motion.div>
        </Container>
      </section>
    </div>);
}
