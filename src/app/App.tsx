import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

/**
 * React Native Passwordless Authentication App
 * Web Demo Implementation
 * 
 * Built for Lokal App Job Application Assignment
 * 
 * Features:
 * - Email + OTP passwordless authentication
 * - 6-digit OTP with 60-second expiry
 * - 3 attempt limit per OTP
 * - Session management with live timer
 * - Analytics event logging
 * - Clean architecture with custom hooks
 * - TypeScript strict mode
 * - Functional components only
 */

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
