import { useEffect, useRef, useState, useMemo } from 'react';
import { universities, programmes } from '../data.js';

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function StatItem({ item, isVisible, delayIndex }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrameId;

    const delayTimeout = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / item.duration, 1);
        const eased = easeOutExpo(progress);
        const currentVal = Math.floor(eased * item.target);
        setCount(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCount(item.target);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delayIndex * 120);

    return () => {
      clearTimeout(delayTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, item.target, item.duration, delayIndex]);

  const displayValue = item.formatComma
    ? count.toLocaleString('en-IN')
    : count;

  return (
    <div
      className={`stats-item animated-stat-item ${isVisible ? 'visible' : ''} ${item.label.includes('Free') ? 'stat-item-free' : ''}`}
      style={{ transitionDelay: `${delayIndex * 0.1}s` }}
    >
      <div className="stats-num">
        <span className="stats-num-digit">{displayValue}</span>
        <span className="stats-num-suffix">{item.suffix}</span>
      </div>
      <div className="stats-label">{item.label}</div>
    </div>
  );
}

export function AnimatedStats() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const statsData = useMemo(() => {
    const specSet = new Set();
    programmes.forEach((p) => {
      p.specialisations?.forEach((s) => specSet.add(s));
    });
    const specsTarget = Math.max(260, Math.floor(specSet.size / 10) * 10);

    return [
      {
        target: universities.length,
        suffix: '+',
        label: 'Top Universities & Colleges',
        duration: 1600,
      },
      {
        target: programmes.length,
        suffix: '+',
        label: 'Accredited Online Programmes',
        duration: 1800,
      },
      {
        target: specsTarget,
        suffix: '+',
        label: 'Career Specialisations',
        duration: 1700,
      },
      {
        target: 100,
        suffix: '%',
        label: 'Free & Independent',
        duration: 1500,
      },
    ];
  }, []);

  useEffect(() => {
    // If IntersectionObserver is not supported, show immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-strip-section" aria-label="Platform Statistics" ref={containerRef}>
      <div className="stats-strip-container">
        <div className="stats-strip-card">
          {statsData.map((item, idx) => (
            <StatItem
              key={item.label}
              item={item}
              isVisible={isVisible}
              delayIndex={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
