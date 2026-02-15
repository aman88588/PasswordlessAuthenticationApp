import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { useOtpManager } from '../hooks/useOtpManager';
import { useCountdown } from '../hooks/useCountdown';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Clock, Mail, RotateCw, ArrowLeft, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Card3D } from '../components/Card3D';
import { FloatingParticles } from '../components/FloatingParticles';

/**
 * OTP Verification Screen - Lokal App Theme
 * Handles OTP input, validation, countdown, and attempts with 3D animations
 */
export const OtpVerificationScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = searchParams.get('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [shake, setShake] = useState(false);

  const { otpData, loading, generateOtp, validateOtp } = useOtpManager(email || '');
  const { secondsRemaining, isExpired, reset } = useCountdown(60);

  // Generate OTP on mount
  useEffect(() => {
    if (!email) {
      toast.error('No email provided');
      navigate('/');
      return;
    }

    if (!otpGenerated) {
      const generatedOtp = generateOtp();
      setOtpGenerated(true);
      toast.success(`OTP sent to ${email}`, {
        description: `For demo: ${generatedOtp}`,
        duration: 5000,
      });
    }
  }, [email, navigate, otpGenerated, generateOtp]);

  const handleVerify = () => {
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const result = validateOtp(otp);

    if (result.success) {
      toast.success('Login successful!');
      login(email);
      navigate('/session');
    } else {
      // Handle different error types
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      switch (result.error) {
        case 'NO_OTP':
          setError('No OTP found. Please request a new one.');
          break;
        case 'EXPIRED':
          setError('OTP expired. Please request a new one.');
          break;
        case 'MAX_ATTEMPTS':
          setError('Maximum attempts exceeded. Please request a new OTP.');
          break;
        case 'INCORRECT':
          const attemptsLeft = 3 - (otpData?.attempts || 0);
          setError(`Incorrect OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
          break;
        default:
          setError('Verification failed. Please try again.');
      }
      setOtp('');
    }
  };

  const handleResend = () => {
    setError('');
    setOtp('');
    const newOtp = generateOtp();
    reset(60);
    toast.success('New OTP sent!', {
      description: `For demo: ${newOtp}`,
      duration: 5000,
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const attemptsRemaining = otpData ? 3 - otpData.attempts : 3;
  const isMaxAttemptsReached = attemptsRemaining <= 0;
  const canVerify = otp.length === 6 && !isExpired && !isMaxAttemptsReached && !loading;

  // Calculate progress for timer circle
  const progress = (secondsRemaining / 60) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      
      <div className="w-full max-w-md relative z-10">
        <Card3D className="w-full">
          <div className="space-y-6">
            {/* Header with animated icon */}
            <div className="text-center space-y-4">
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl neon-glow">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Verify OTP
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  Enter the 6-digit code sent to
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm font-medium text-gray-700 bg-orange-50 px-4 py-2 rounded-lg inline-flex">
                  <Mail className="h-4 w-4 text-orange-600" />
                  {email}
                </div>
              </motion.div>
            </div>

            {/* OTP Input with animation */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={shake ? 'animate-shake' : ''}>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading || isExpired || isMaxAttemptsReached}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <InputOTPSlot
                          index={index}
                          className="w-12 h-14 text-xl font-bold border-2 border-orange-200 focus:border-orange-500 rounded-xl bg-white transition-all duration-300 hover:border-orange-400"
                        />
                      </motion.div>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </motion.div>

            {/* Circular Timer */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative w-24 h-24">
                {/* Background Circle */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    className={isExpired ? 'text-red-500' : 'text-orange-500'}
                    initial={{ strokeDasharray: '276.46', strokeDashoffset: '276.46' }}
                    animate={{ strokeDashoffset: 276.46 - (276.46 * progress) / 100 }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className={`h-5 w-5 mb-1 ${isExpired ? 'text-red-600' : 'text-orange-600'}`} />
                  <span className={`text-lg font-bold ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                    {isExpired ? '0s' : `${secondsRemaining}s`}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Attempts Badge */}
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className={`px-4 py-2 rounded-full border-2 ${
                isMaxAttemptsReached
                  ? 'bg-red-50 border-red-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                {isMaxAttemptsReached ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600 inline mr-2" />
                    <span className="text-red-600 font-semibold text-sm">Maximum attempts exceeded</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 inline mr-2" />
                    <span className="text-green-600 font-semibold text-sm">
                      {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Error Message with Animation */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verify Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={handleVerify}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 button-3d relative overflow-hidden group"
                disabled={!canVerify}
              >
                <Zap className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Verify OTP
              </Button>
            </motion.div>

            {/* Resend Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full h-12 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-300 button-3d"
                disabled={loading}
              >
                <RotateCw className="mr-2 h-5 w-5" />
                Resend OTP
              </Button>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={handleBack}
                variant="ghost"
                className="w-full text-gray-600 hover:text-orange-600 transition-colors duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </motion.div>

            {/* Info */}
            <motion.div
              className="text-xs text-center text-gray-500 bg-orange-50 p-3 rounded-lg border border-orange-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p>Check the notification for your OTP code</p>
            </motion.div>
          </div>
        </Card3D>
      </div>
    </div>
  );
};
