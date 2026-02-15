import { useState, useEffect, useRef, useMemo } from 'react';
import { formatDuration } from '../utils/timeUtils';

/**
 * Custom hook for session timer
 * Tracks elapsed time since session start
 * Returns duration in seconds and formatted string
 * 
 * Key features:
 * - Uses useRef to prevent memory leaks
 * - Properly cleans up interval on unmount
 * - Doesn't reset on component re-render
 * - Updates every second
 */
export const useSessionTimer = (startTime: number) => {
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Calculate initial duration
    const calculateDuration = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDuration(elapsed);
    };

    // Set initial value
    calculateDuration();

    // Start interval
    intervalRef.current = setInterval(calculateDuration, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime]);

  // Memoize formatted duration to avoid unnecessary recalculations
  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);

  return {
    duration,
    formattedDuration,
  };
};
