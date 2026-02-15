import { OtpState, OtpData, ValidationResult } from '../types/otp';
import { analytics } from './analytics';

/**
 * OTP Manager Service
 * Handles OTP generation, validation, and state management
 * 
 * Business Rules:
 * - 6-digit OTP
 * - 60-second expiry
 * - 3 maximum attempts per OTP
 * - Per-email storage
 * - New OTP invalidates old one
 */

class OtpManager {
  private otpStore: OtpState = {};

  /**
   * Generates a 6-digit OTP for the given email
   * Invalidates any existing OTP for that email
   */
  generateOtp(email: string): string {
    // Generate random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();

    // Store OTP data
    this.otpStore[email] = {
      otp,
      generatedAt: now,
      expiresAt: now + 60000, // 60 seconds
      attempts: 0,
    };

    // Log analytics event
    analytics.logOtpGenerated(email);

    // For demo purposes, log the OTP to console
    console.log(`[OTP Manager] Generated OTP for ${email}: ${otp}`);

    return otp;
  }

  /**
   * Validates the input OTP against stored OTP
   * Handles expiry, attempt limits, and validation logic
   */
  validateOtp(email: string, inputOtp: string): ValidationResult {
    const stored = this.otpStore[email];

    // Check if OTP exists
    if (!stored) {
      analytics.logOtpValidationFailure(email, 'no_otp');
      return { success: false, error: 'NO_OTP' };
    }

    // Check if expired
    if (Date.now() > stored.expiresAt) {
      analytics.logOtpValidationFailure(email, 'expired');
      return { success: false, error: 'EXPIRED' };
    }

    // Check if max attempts reached
    if (stored.attempts >= 3) {
      analytics.logOtpValidationFailure(email, 'max_attempts');
      return { success: false, error: 'MAX_ATTEMPTS' };
    }

    // Increment attempts
    stored.attempts++;

    // Validate OTP
    if (stored.otp !== inputOtp) {
      analytics.logOtpValidationFailure(email, 'incorrect');
      return { success: false, error: 'INCORRECT' };
    }

    // Success
    analytics.logOtpValidationSuccess(email, stored.attempts);
    return { success: true };
  }

  /**
   * Gets the OTP data for a specific email
   */
  getOtpData(email: string): OtpData | null {
    return this.otpStore[email] || null;
  }

  /**
   * Clears OTP data for a specific email
   */
  clearOtp(email: string): void {
    delete this.otpStore[email];
  }

  /**
   * Gets all OTP data (for debugging)
   */
  getAllOtpData(): OtpState {
    return { ...this.otpStore };
  }
}

// Export singleton instance
export const otpManager = new OtpManager();
