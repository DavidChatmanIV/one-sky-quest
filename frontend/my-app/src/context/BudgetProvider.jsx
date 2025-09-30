import React, { useMemo, useState } from "react";
import { BudgetContext } from "./BudgetContext"; 

export function BudgetProvider({ initialTravelers = 1, children }) {
  const [mode, setMode] = useState("personal");
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
    }),
    [mode, travelers, personalCap, groupCap, currentTotal, categories]
  );

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
}
