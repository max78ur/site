import { Zap } from 'lucide-react';
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage';
import { getServiceById } from '@/data/services';

export default function PowerOnly() {
  return (
    <ServiceDetailPage
      service={getServiceById('power-only')}
      icon={<Zap size={23} />}
      headline="Power when you need it."
      paragraphs={[
        'Power-only dispatch for carriers with trailers who need a tractor. We connect your power unit with drop-and-hook loads, minimizing deadhead miles and keeping your equipment earning.',
        'Quick turnaround times and trailer pool management mean less waiting and more loaded miles for your power unit.',
      ]}
      features={[
        'Drop-and-hook load booking',
        'Trailer pool management',
        'Minimal deadhead miles',
        'Quick turnaround',
      ]}
      equipment="Tractor-only dispatch"
    />
  );
}
