"use client";

import { useEffect, useState } from "react";

type TrackingStep = {
  label: string;
  isComplete: boolean;
  isActive: boolean;
  time?: string;
};

export function OrderTracking({ createdAtStr, status }: { createdAtStr: string; status: string }) {
  // We need hydration-safe time calculation.
  const [steps, setSteps] = useState<TrackingStep[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // If it's pending, it hasn't even started
    if (status === "PENDING") {
      setSteps([
        { label: "Aguardando Pagamento", isComplete: false, isActive: true },
        { label: "Na Loja", isComplete: false, isActive: false },
        { label: "Coletado", isComplete: false, isActive: false },
        { label: "Em Transito", isComplete: false, isActive: false },
        { label: "Em Rota", isComplete: false, isActive: false },
        { label: "Entregue", isComplete: false, isActive: false },
      ]);
      return;
    }

    const calculateTracking = () => {
      const createdTime = new Date(createdAtStr).getTime();
      const now = Date.now();
      const diffMinutes = Math.floor((now - createdTime) / 1000 / 60);

      const oneHour = 60;
      const twoHours = 120;
      const threeDays = 3 * 24 * 60; // 4320 minutes
      const threeDaysAnd15m = threeDays + 15;

      const items: TrackingStep[] = [
        { label: "Na Loja", isComplete: diffMinutes >= oneHour, isActive: diffMinutes < oneHour, time: new Date(createdTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) },
        { label: "Coletado", isComplete: diffMinutes >= twoHours, isActive: diffMinutes >= oneHour && diffMinutes < twoHours, time: diffMinutes >= oneHour ? new Date(createdTime + oneHour * 60000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined },
        { label: "Em Transito", isComplete: diffMinutes >= threeDays, isActive: diffMinutes >= twoHours && diffMinutes < threeDays, time: diffMinutes >= twoHours ? new Date(createdTime + twoHours * 60000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined },
        { label: "Em Rota", isComplete: diffMinutes >= threeDaysAnd15m, isActive: diffMinutes >= threeDays && diffMinutes < threeDaysAnd15m, time: diffMinutes >= threeDays ? new Date(createdTime + threeDays * 60000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined },
        { label: "Entregue", isComplete: diffMinutes >= threeDaysAnd15m, isActive: diffMinutes >= threeDaysAnd15m, time: diffMinutes >= threeDaysAnd15m ? new Date(createdTime + threeDaysAnd15m * 60000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined },
      ];

      setSteps(items);
    };

    calculateTracking();
    const interval = setInterval(calculateTracking, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [createdAtStr, status]);

  if (!mounted) {
    return (
      <div className="mt-4 animate-pulse h-16 w-full rounded-lg bg-zinc-900/50" />
    );
  }

  return (
    <div className="mt-6 w-full overflow-x-auto pb-2">
      <div className="flex min-w-[500px] items-start justify-between relative px-4">
        {/* Progress Line Background */}
        <div className="absolute top-4 left-8 right-8 h-1 bg-zinc-800 -z-10" />
        
        {/* Progress Line Active (calculate width) */}
        <div 
          className="absolute top-4 left-8 h-1 bg-emerald-500 transition-all duration-1000 -z-10"
          style={{ 
            width: steps.length > 0 ? `${(steps.filter(s => s.isComplete).length / Math.max(1, steps.length - 1)) * 100}%` : '0%',
            maxWidth: 'calc(100% - 4rem)' 
          }}
        />

        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 relative w-1/5">
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                step.isComplete
                  ? "bg-emerald-500 border-zinc-900 text-zinc-950 scale-100"
                  : step.isActive
                  ? "bg-zinc-900 border-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                  : "bg-zinc-900 border-zinc-800 scale-90"
              }`}
            >
              {step.isComplete && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {step.isActive && !step.isComplete && (
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </div>
            
            <div className="text-center">
              <div
                className={`text-xs font-semibold ${
                  step.isComplete || step.isActive ? "text-zinc-200" : "text-zinc-600"
                }`}
              >
                {step.label}
              </div>
              {step.time && (
                <div className="text-[10px] text-zinc-500 mt-0.5">{step.time}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
