import React from "react";

export default function TripPreview({ trip }) {
  if (!trip) return null;
  const { title, dates, priceFrom, rating, nonstop, perks = [] } = trip;

  return (
    <div className="qf-trippill">
      <div className="qf-triptitle">{title}</div>
      <div className="qf-tripmeta">{dates}</div>
      <div className="qf-tripchips">
        {typeof priceFrom === "number" && (
          <span className="qf-chip">From ${priceFrom}</span>
        )}
        {nonstop && <span className="qf-chip">Nonstop</span>}
        {rating && <span className="qf-chip">{rating}★</span>}
        {perks?.map((p) => (
          <span key={p} className="qf-chip">
            {p}
          </span>
        ))}
        <span className="qf-chip" style="cursor:pointer">
          View details →
        </span>
      </div>
    </div>
  );
}
