/**
 * Time formatting utilities
 */

/**
 * Formats a timestamp to HH:MM:SS format
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Formats duration in seconds to MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates remaining time in seconds
 */
export const getRemainingTime = (expiresAt: number): number => {
  const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
  return Math.max(0, remaining);
};
