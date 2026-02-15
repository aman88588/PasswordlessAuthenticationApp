import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for countdown timer
 * Counts down from initial seconds to 0
 * Returns remaining time and reset function
 */
export const useCountdown = (initialSeconds: number) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive || secondsRemaining <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, secondsRemaining]);

  const reset = (newSeconds: number = initialSeconds) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSecondsRemaining(newSeconds);
    setIsActive(true);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
  };

  return {
    secondsRemaining,
    isExpired: secondsRemaining === 0,
    reset,
    stop,
  };
};
