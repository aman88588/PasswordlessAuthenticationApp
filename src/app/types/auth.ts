export interface User {
  email: string;
  sessionStartTime: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ValidationResult {
  success: boolean;
  error?: 'NO_OTP' | 'EXPIRED' | 'MAX_ATTEMPTS' | 'INCORRECT';
}
