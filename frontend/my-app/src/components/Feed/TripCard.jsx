import React from "react";
export default function TripCard({
  href = "#",
  image = "",
  destination = "Trip",
  dates = "",
  price,
  people,
  tags = [],
}) {
  const safeAlt = `${destination} preview`;

  return (
    <a
      className="trip-card"
      href={href}
      aria-label={`Open trip to ${destination}`}
    >
      <div className="trip-thumb">
        {image ? (
          <img src={image} alt={safeAlt} loading="lazy" />
        ) : (
          <div aria-hidden className="w-full h-full" />
        )}
      </div>

      <div className="trip-main">
        <div className="trip-destination">{destination}</div>
        {dates && <div className="trip-dates">{dates}</div>}

        {(price || people || (tags && tags.length)) && (
          <div className="trip-meta">
            {price && <span className="trip-badge">From {price}</span>}
            {people && <span className="trip-badge">{people}</span>}
            {tags.slice(0, 3).map((t, i) => (
              <span className="trip-badge" key={`${t}-${i}`}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="trip-cta">
          View details
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12h10M13 6l6 6-6 6" fill="none" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </a>
  );
}
