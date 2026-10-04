import React from 'react';

/**
 * StarRating – Displays filled/partial/empty gold stars with numeric rating & count.
 * Usage: <StarRating rating={4.7} count={380} />
 */
export function StarRating({ rating = 0, count = 0, size = 14, gap = 1 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Full star
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#F5A623" stroke="none" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else if (i === fullStars && partial > 0) {
      // Partial star
      const pct = Math.round(partial * 100);
      const clipId = `star-clip-${Math.random().toString(36).slice(2, 8)}`;
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width={`${pct}%`} height="24" />
            </clipPath>
          </defs>
          {/* Empty star background */}
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#3A3F4B" stroke="none" />
          {/* Filled portion */}
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F5A623" stroke="none" clipPath={`url(#${clipId})`} />
        </svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#3A3F4B" stroke="none" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
  }

  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of 5 (${count} reviews)`}>
      <div className="star-rating-stars" style={{ display: 'inline-flex', gap }}>
        {stars}
      </div>
      <span className="star-rating-number">{rating.toFixed(1)}</span>
      <span className="star-rating-count">({count.toLocaleString('en-IN')})</span>
    </div>
  );
}
