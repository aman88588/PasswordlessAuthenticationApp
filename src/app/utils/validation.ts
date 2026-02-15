/**
 * Validation utilities
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates OTP format (6 digits)
 */
export const isValidOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Sanitizes email (lowercase, trim)
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};
