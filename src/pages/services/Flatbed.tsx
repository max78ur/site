import { Truck } from 'lucide-react';
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage';
import { getServiceById } from '@/data/services';

export default function Flatbed() {
  return (
    <ServiceDetailPage
      service={getServiceById('flatbed')}
      icon={<Truck size={23} />}
      headline="Heavy haul, simplified."
      paragraphs={[
        'Flatbed and step-deck dispatch for construction materials, machinery, steel, lumber, and oversized loads. We handle permits, routing, and securement compliance so you can focus on the road.',
        'From oversize permits to load securement, our dispatch team manages the details that come with heavy-haul freight.',
      ]}
      features={[
        'Flatbed and step-deck dispatch',
        'Oversize permit support',
        'Heavy equipment hauling',
        'Securement compliance',
      ]}
      equipment="Flatbed / Step-Deck"
    />
  );
}
