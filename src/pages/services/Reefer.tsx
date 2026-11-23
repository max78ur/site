import { Snowflake } from 'lucide-react';
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage';
import { getServiceById } from '@/data/services';

export default function Reefer() {
  return (
    <ServiceDetailPage
      service={getServiceById('reefer')}
      icon={<Snowflake size={23} />}
      headline="Cold chain logistics, with care."
      paragraphs={[
        'Refrigerated trailer dispatch for perishable goods — produce, dairy, meat, frozen foods, pharmaceuticals, and more. We coordinate temperature-sensitive loads with strict compliance and on-time delivery.',
        'From pre-trip temperature checks to delivery confirmation, our team keeps your reefer unit moving and your cargo within spec.',
      ]}
      features={[
        'Temperature-controlled freight',
        'Produce, dairy, meat, and pharmaceuticals',
        'Cold chain compliance',
        'Reefer unit monitoring support',
      ]}
      equipment="Temperature-controlled"
    />
  );
}
