import { motion } from 'framer-motion';
import { Truck, CheckCircle } from 'lucide-react';

export function LoadingScreen({ isLoading, onComplete }: { isLoading: boolean; onComplete: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8"
      >
        <div
          className="w-16 h-16 rounded-2xl bg-primary-red flex items-center justify-center"
        >
          <Truck size={32} className="text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
          TruckAxic
        </h1>

        <p className="mt-4 text-lg text-gray-300">
          Premium Truck Dispatch Solutions
        </p>

        {isLoading && (
          <motion.div
            className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center mt-8"
            role="status"
            aria-live="polite"
          >
            <svg
              className="text-gray-400 animate-spin w-8 h-8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="fill-none stroke-current stroke-8"
                cx="12"
                cy="12"
                r="10"
              />
            </svg>
          </motion.div>
        )}

        {!isLoading && (
          <motion.div
            className="w-12 h-12 rounded-full bg-primary-red flex items-center justify-center"
            onClick={onComplete}
          >
            <CheckCircle size={32} className="text-white" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}