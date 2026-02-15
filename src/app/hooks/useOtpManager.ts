import { useState, useCallback } from 'react';
import { otpManager } from '../services/otpManager';
import { OtpData, ValidationResult } from '../types/otp';

/**
 * Custom hook for OTP management
 * Provides OTP generation, validation, and state tracking
 */
export const useOtpManager = (email: string) => {
  const [otpData, setOtpData] = useState<OtpData | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Generates a new OTP for the email
   */
  const generateOtp = useCallback(() => {
    setLoading(true);
    const otp = otpManager.generateOtp(email);
    const data = otpManager.getOtpData(email);
    setOtpData(data);
    setLoading(false);
    return otp;
  }, [email]);

  /**
   * Validates the input OTP
   */
  const validateOtp = useCallback(
    (inputOtp: string): ValidationResult => {
      setLoading(true);
      const result = otpManager.validateOtp(email, inputOtp);
      const data = otpManager.getOtpData(email);
      setOtpData(data);
      setLoading(false);
      return result;
    },
    [email]
  );

  /**
   * Refreshes OTP data from manager
   */
  const refreshOtpData = useCallback(() => {
    const data = otpManager.getOtpData(email);
    setOtpData(data);
  }, [email]);

  /**
   * Clears OTP data
   */
  const clearOtp = useCallback(() => {
    otpManager.clearOtp(email);
    setOtpData(null);
  }, [email]);

  return {
    otpData,
    loading,
    generateOtp,
    validateOtp,
    refreshOtpData,
    clearOtp,
  };
};
