import { Package } from 'lucide-react';
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage';
import { getServiceById } from '@/data/services';

export default function DryVan() {
  return (
    <ServiceDetailPage
      service={getServiceById('dry-van')}
      icon={<Package size={23} />}
      headline="General freight, handled right."
      paragraphs={[
        'Dry van trailers are the backbone of American freight. We dispatch boxed, palletized, and general cargo loads for 53-foot dry van trailers — from short-haul regional runs to long-haul coast-to-coast lanes.',
        'Our dispatch team secures consistent, well-paying dry van loads so your trailers stay loaded and your revenue stays predictable.',
      ]}
      features={[
        '53-foot dry van load booking',
        'Regional and OTR lanes',
        'Palletized and boxed freight',
        'Dedicated dispatcher',
      ]}
      equipment="Dry Van 53′"
    />
  );
}
