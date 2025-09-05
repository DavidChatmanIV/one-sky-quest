import React, { createContext, useMemo, useState } from "react";

export const BudgetContext = createContext(null);

export function BudgetProvider({ initialTravelers = 1, children }) {
  const [mode, setMode] = useState("personal"); // "personal" | "group"
  const [travelers, setTravelers] = useState(initialTravelers);
  const [personalCap, setPersonalCap] = useState(1500);
  const [groupCap, setGroupCap] = useState(4000);
  const [currentTotal, setCurrentTotal] = useState(1250);
  const [categories, setCategories] = useState({
    flights: 40,
    stays: 35,
    food: 15,
    activities: 10,
  });

  const value = useMemo(
    () => ({
      mode,
      setMode,
      travelers,
      setTravelers,
      personalCap,
      setPersonalCap,
      groupCap,
      setGroupCap,
      currentTotal,
      setCurrentTotal,
      categories,
      setCategories,

      effectiveCap: mode === "group" ? groupCap : personalCap,
      perPersonTarget:
        mode === "group" && travelers > 0 ? groupCap / travelers : personalCap,

      computeBadge(totalPrice) {
        const perPerson =
          mode === "group" && travelers > 0
            ? totalPrice / travelers
            : totalPrice;
        const cap =
          mode === "group" ? groupCap / Math.max(travelers, 1) : personalCap;
        if (!cap) return { color: "default", text: "Set a budget" };

        const diff = cap - perPerson;
        if (diff >= 0) {
          return {
            color: "green",
            text:
              mode === "group"
                ? `Within group budget ($${Math.round(
                    diff
                  ).toLocaleString()} left / person)`
                : `Within budget ($${Math.round(diff).toLocaleString()} left)`,
          };
        }
        return {
          color: "red",
          text:
            mode === "group"
              ? `$${Math.round(Math.abs(diff)).toLocaleString()} over / person`
              : `$${Math.round(Math.abs(diff)).toLocaleString()} over`,
        };
      },
    }),
    [mode, travelers, personalCap, groupCap, currentTotal, categories]
  );

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
}
