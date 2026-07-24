import { createContext, useContext, useState, type ReactNode } from "react";
import type { BackendEvaluation } from "./types";

interface EvaluationContextValue {
  evaluation: BackendEvaluation | null;
  setEvaluation: (e: BackendEvaluation | null) => void;
}

const EvaluationContext = createContext<EvaluationContextValue | undefined>(undefined);

export function EvaluationProvider({ children }: { children: ReactNode }) {
  const [evaluation, setEvaluation] = useState<BackendEvaluation | null>(null);
  return (
    <EvaluationContext.Provider value={{ evaluation, setEvaluation }}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation(): EvaluationContextValue {
  const ctx = useContext(EvaluationContext);
  if (!ctx) throw new Error("useEvaluation must be used within EvaluationProvider");
  return ctx;
}
