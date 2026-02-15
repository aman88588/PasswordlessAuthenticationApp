import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { isValidEmail, sanitizeEmail } from '../utils/validation';
import { Mail, Loader2, Send, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Card3D } from '../components/Card3D';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { FloatingParticles } from '../components/FloatingParticles';

/**
 * Login Screen - Lokal App Theme
 * Email input and OTP generation with 3D animations
 */
export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError('');

    // Validate email
    const sanitized = sanitizeEmail(email);
    if (!sanitized) {
      setError('Please enter your email');
      return;
    }

    if (!isValidEmail(sanitized)) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulate loading state
    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Show success message
      toast.success('Redirecting to OTP verification...', {
        duration: 2000,
      });
      
      // Navigate to OTP verification with email as URL parameter
      navigate(`/verify-otp?email=${encodeURIComponent(sanitized)}`);
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Navigation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendOtp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      
      <div className="w-full max-w-md relative z-10">
        {/* Animated Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <AnimatedLogo size="lg" />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Lokal Auth</h1>
          <p className="text-gray-600">Secure. Fast. Passwordless.</p>
        </motion.div>

        {/* 3D Card */}
        <Card3D className="w-full">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <motion.h2
                className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Welcome Back
              </motion.h2>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Enter your email to receive a one-time password
              </motion.p>
            </div>

            {/* Email Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-orange-500 transition-transform group-hover:scale-110" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-11 h-12 bg-white border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 rounded-xl"
                  disabled={loading}
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  className="text-sm text-red-600 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Send OTP Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleSendOtp}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 button-3d relative overflow-hidden group"
                disabled={loading}
              >
                {/* Button Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Info Text */}
            <motion.div
              className="text-xs text-gray-500 text-center space-y-1 bg-orange-50 p-3 rounded-lg border border-orange-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="flex items-center justify-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Demo Mode Active
              </p>
              <p>OTP will be displayed in the notification</p>
            </motion.div>
          </div>
        </Card3D>

        {/* Footer */}
        <motion.div
          className="text-center mt-6 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Powered by <span className="font-semibold gradient-text">Lokal App</span></p>
        </motion.div>
      </div>
    </div>
  );
};
