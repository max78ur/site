import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { stats } from '@/data/testimonials';

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const parsed = value.match(/^([^0-9]*)([\d,]+)(.*)$/);

  useEffect(() => {
    if (!parsed) return;
    const target = Number(parsed[2].replace(/,/g, ''));
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setCount(target);
          return;
        }

        const start = performance.now();
        const duration = 1100;
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 4;
          setCount(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [parsed?.[2]]);

  if (!parsed) return <>{value}</>;

  const formatted = count.toLocaleString('en-US');
  return (
    <span ref={ref} aria-label={value}>
      {parsed[1]}
      {formatted}
      {parsed[3]}
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="section statistics-section">
      <Container>
        <div className="section-heading statistics-heading">
          <div>
            <span className="section-kicker">06 / The numbers behind the miles</span>
            <h2 className="section-title">
              Built to keep your operation moving.
            </h2>
          </div>
        </div>
        <div className="statistics-grid">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className="stat-card"
            >
              <span className="stat-index">0{index + 1}</span>
              <div className="stat-value">
                <AnimatedValue value={stat.value} />
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
