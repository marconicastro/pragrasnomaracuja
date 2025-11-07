/**
 * Urgency Bar - Barra de urgência com countdown
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function UrgencyBar() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 47,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-red-600 text-white py-2 px-2 sm:px-4 text-center animate-pulse">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-center">
            ATENÇÃO: Apenas 47 minutos restantes para garantir o desconto de 87%!
          </span>
        </div>
        <div className="bg-red-800 px-2 py-1 rounded font-mono text-xs sm:text-sm">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
