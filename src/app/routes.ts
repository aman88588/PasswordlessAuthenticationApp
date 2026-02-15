import { createBrowserRouter } from 'react-router';
import { LoginScreen } from './screens/LoginScreen';
import { OtpVerificationScreen } from './screens/OtpVerificationScreen';
import { SessionScreen } from './screens/SessionScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginScreen,
  },
  {
    path: '/verify-otp',
    Component: OtpVerificationScreen,
  },
  {
    path: '/session',
    Component: SessionScreen,
  },
]);
