import React from 'react';
import { inr } from '../data.js';

/**
 * Reusable FeeSlider component for filtering programmes by total fee.
 *
 * Props:
 * - value: number | 'All' | '' (if 'All', empty string or >= max, it represents 'No limit')
 * - onChange: (newValue: number | 'All') => void
 * - min: number (default 20000)
 * - max: number (default 500000)
 * - step: number (default 10000)
 */
export default function FeeSlider({
  value,
  onChange,
  min = 20000,
  max = 500000,
  step = 10000,
}) {
  const isNoLimit =
    value === 'All' ||
    value === '' ||
    value === undefined ||
    value === null ||
    Number(value) >= max;

  const numericValue = isNoLimit
    ? max
    : Math.min(max, Math.max(min, Number(value) || max));

  const percent = Math.min(100, Math.max(0, ((numericValue - min) / (max - min)) * 100));

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    if (val >= max) {
      onChange('All');
    } else {
      onChange(val);
    }
  };

  const presets = [
    { label: '₹50k', val: 50000 },
    { label: '₹1L', val: 100000 },
    { label: '₹2L', val: 200000 },
    { label: '₹3L', val: 300000 },
    { label: 'No limit', val: 'All' },
  ];

  return (
    <div className="fee-slider-container">
      <div className="fee-slider-header">
        <div className="fg-title" style={{ margin: 0 }}>Fees (total)</div>
        <span className={`fee-slider-badge ${isNoLimit ? 'is-nolimit' : ''}`}>
          {isNoLimit ? 'No limit' : `Up to ${inr(numericValue)}`}
        </span>
      </div>

      <div className="fee-range-track-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={handleSliderChange}
          className="fee-range-input"
          style={{
            background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${percent.toFixed(1)}%, #E2E8F0 ${percent.toFixed(1)}%, #E2E8F0 100%)`
          }}
          aria-label="Filter by maximum total fee"
        />
      </div>

      <div className="fee-slider-labels">
        <span>₹20k</span>
        <span>₹1.5L</span>
        <span>₹3L</span>
        <span>No limit</span>
      </div>

      <div className="fee-slider-presets">
        {presets.map((p) => {
          const isActive =
            p.val === 'All'
              ? isNoLimit
              : !isNoLimit && numericValue === p.val;

          return (
            <button
              key={p.label}
              type="button"
              className={`fee-preset-pill ${isActive ? 'active' : ''}`}
              onClick={() => onChange(p.val)}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
