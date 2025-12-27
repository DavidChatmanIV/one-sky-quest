export const XP_RULES = {
  // ---- Core: Soft launch safe defaults ----
  BOOKING_CONFIRMED: { xp: 120, label: "Booking confirmed" },
  SAVED_TRIP: { xp: 15, label: "Saved a trip" },
  PROFILE_COMPLETED: { xp: 60, label: "Completed profile" },
  FEEDBACK_SUBMITTED: { xp: 25, label: "Submitted feedback" },

  // ---- Social / engagement ----
  POST_CREATED: { xp: 10, label: "Created a post" },
  COMMENT_CREATED: { xp: 5, label: "Commented" },

  // ---- Manual / seasonal ----
  SEASONAL_AWARD: { xp: 0, label: "Seasonal award (amount set by admin)" },
  ADMIN_GRANT: { xp: 0, label: "Admin grant (amount set by admin)" },
};

export const XP_DAILY_CAP = 500; // soft launch guardrail
export const XP_MAX_SINGLE_AWARD = 1000; // admin can still do more if you want, but MVP guardrail