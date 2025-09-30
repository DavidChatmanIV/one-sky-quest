import { useContext } from "react";
import { BudgetContext } from "./BudgetContext";

/**
 * Shared budget state hook.
 * Must be called inside <BudgetProvider>.
 */
export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error("useBudget must be used inside <BudgetProvider>");
  }
  return ctx;
}

export default useBudget;
