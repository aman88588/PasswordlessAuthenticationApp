export interface OtpData {
  otp: string;
  generatedAt: number;
  expiresAt: number;
  attempts: number;
}

export interface OtpState {
  [email: string]: OtpData;
}

export interface OtpManagerResult {
  generateOtp: (email: string) => string;
  validateOtp: (email: string, inputOtp: string) => ValidationResult;
  getOtpData: (email: string) => OtpData | null;
  clearOtp: (email: string) => void;
}

export interface ValidationResult {
  success: boolean;
  error?: 'NO_OTP' | 'EXPIRED' | 'MAX_ATTEMPTS' | 'INCORRECT';
}
