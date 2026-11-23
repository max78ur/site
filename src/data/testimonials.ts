export interface Testimonial {
  id: string;
  name: string;
  title: string;
  location: string;
  content: string;
  rating: number;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'James Carter',
    title: 'Owner-Operator',
    location: 'Dallas, TX',
    content:
      "TruckAxic transformed my dispatch operation. I'm hauling higher-paying loads than ever before, and the support team is available 24/7. Best decision I made for my business.",
    rating: 5,
    image: '/avatars/james.jpg',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    title: 'Fleet Owner',
    location: 'Atlanta, GA',
    content:
      'Professional, reliable, and results-driven. The rate negotiation team consistently beats my previous rates. My trucks rarely sit idle thanks to TruckAxic.',
    rating: 5,
    image: '/avatars/sarah.jpg',
  },
  {
    id: '3',
    name: 'Michael Torres',
    title: 'Owner-Operator',
    location: 'Chicago, IL',
    content:
      'The reefer dispatch service is outstanding. Temperature-sensitive loads are handled with care, and I always know where my next load is coming from.',
    rating: 5,
    image: '/avatars/michael.jpg',
  },
  {
    id: '4',
    name: 'Daniel Wright',
    title: 'Fleet Manager',
    location: 'Los Angeles, CA',
    content:
      'Flatbed and oversize permits used to be a headache. TruckAxic handles everything seamlessly. Communication is crystal clear and payments are on time.',
    rating: 5,
    image: '/avatars/daniel.jpg',
  },
];

export const stats = [
  { value: '10K+', label: 'Loads Delivered Monthly' },
  { value: '500+', label: 'Active Carriers' },
  { value: '48', label: 'States Covered' },
  { value: '24/7', label: 'Dispatch Support' },
  { value: '99%', label: 'On-Time Delivery' },
  { value: '$50M+', label: 'Annual Freight Managed' },
];
