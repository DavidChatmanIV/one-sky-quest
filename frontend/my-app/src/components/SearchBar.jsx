import React from "react";
import "../styles/SearchBar.css";

export default function SearchBar({
  onSearch = () => {},
  values = {
    where: "",
    start: "",
    end: "",
    guests: "2 adults · 1 room",
  },
  setValues = () => {},
}) {
  const update = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e?.target ? e.target.value : e }));

  return (
    <div className="osq-search">
      {/* row 1: tabs */}
      <div className="osq-search__tabs" role="tablist">
        <button className="tab is-active" role="tab" aria-selected="true">
          🏠 Stays
        </button>
        <button className="tab" role="tab">
          ✈️ Flights
        </button>
        <button className="tab" role="tab">
          🚗 Cars
        </button>
        <button className="tab" role="tab">
          🎁 Packages
        </button>
        <button className="tab" role="tab">
          🧭 Excursions
        </button>
      </div>

      {/* row 2: inputs */}
      <div className="osq-search__grid">
        <label className="field">
          <span className="field__label">Where to?</span>
          <div className="field__control">
            <span className="field__icon">📍</span>
            <input
              className="input"
              placeholder="City, landmark, or address"
              value={values.where}
              onChange={update("where")}
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">Start date</span>
          <div className="field__control">
            <span className="field__icon">📅</span>
            <input
              type="date"
              className="input"
              value={values.start}
              onChange={update("start")}
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">End date</span>
          <div className="field__control">
            <span className="field__icon">📅</span>
            <input
              type="date"
              className="input"
              value={values.end}
              onChange={update("end")}
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">Guests & rooms</span>
          <div className="field__control">
            <span className="field__icon">👥</span>
            <input
              className="input"
              value={values.guests}
              onChange={update("guests")}
            />
          </div>
        </label>

        <div className="field field--cta">
          <button className="search-btn" onClick={onSearch}>
            Search • Earn +50 XP
          </button>
          <div className="smart">
            <span className="zap">⚡</span>
            Smart Plan AI
          </div>
        </div>
      </div>
    </div>
  );
}
