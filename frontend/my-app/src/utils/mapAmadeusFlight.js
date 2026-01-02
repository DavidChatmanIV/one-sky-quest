export function mapAmadeusFlight(offer) {
  const traveler = offer.travelerPricings[0];
  const segment = traveler.fareDetailsBySegment[0];

  return {
    id: offer.id,
    airline: segment.carrierCode,
    flightNumber: segment.segmentId,
    cabin: segment.cabin,
    fareBrand: segment.brandedFare || "Basic",

    price: {
      total: Number(offer.price.total),
      base: Number(offer.price.base),
      taxes: Number(offer.price.total) - Number(offer.price.base),
    },

    baggage: {
      carryOnIncluded: true,
      checkedIncluded: segment.includedCheckedBags?.quantity || 0,
      checkedWeight: segment.includedCheckedBags?.weight || null,
    },

    upgradeEligible: segment.brandedFare !== "ECONOMY_FLEX",
  };
}