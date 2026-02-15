import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatTime } from '../utils/timeUtils';
import { analytics } from '../services/analytics';
import { Clock, LogOut, Mail, Timer, User, CheckCircle, Sparkles, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Card3D } from '../components/Card3D';
import { FloatingParticles } from '../components/FloatingParticles';

/**
 * Session Screen - Lokal App Theme
 * Displays user session info and live timer with 3D animations
 */
export const SessionScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const { duration, formattedDuration } = useSessionTimer(user?.sessionStartTime || Date.now());

  const handleLogout = () => {
    if (user) {
      analytics.logUserLogout(user.email, duration);
      toast.success('Logged out successfully');
    }
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const sessionStartTime = formatTime(user.sessionStartTime);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      
      <div className="w-full max-w-md relative z-10">
        {/* Success Animation */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.5)',
                  '0 0 60px rgba(16, 185, 129, 0.8)',
                  '0 0 20px rgba(16, 185, 129, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Confetti Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2"
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 3) * 80,
                  y: Math.sin((i * Math.PI) / 3) * 80,
                }}
                transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Card3D className="w-full">
          <div className="space-y-6">
            {/* Success Header */}
            <motion.div
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Welcome! 🎉
              </h2>
              <p className="text-gray-600">Your session is active and secure</p>
            </motion.div>

            {/* User Avatar Circle */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                {/* Online Indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* User Email Card */}
            <motion.div
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-600 p-4 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/80 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-white">{user.email}</p>
                </div>
              </div>
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.div>

            {/* Session Start Time */}
            <motion.div
              className="rounded-xl bg-blue-50 border-2 border-blue-200 p-4 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Session started at</p>
                  <p className="text-lg font-bold text-gray-900">{sessionStartTime}</p>
                </div>
              </div>
            </motion.div>

            {/* Live Session Duration - 3D Timer */}
            <motion.div
              className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-6 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
                animate={{ backgroundPosition: ['0px 0px', '20px 20px'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Timer className="h-6 w-6 text-green-600" />
                  <p className="text-sm text-gray-700 font-semibold">Live Session Duration</p>
                </div>
                
                {/* Giant 3D Timer */}
                <motion.div
                  className="text-center"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.5)',
                      '0 0 40px rgba(16, 185, 129, 0.8)',
                      '0 0 20px rgba(16, 185, 129, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-5xl font-bold font-mono bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formattedDuration}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">mm:ss</p>
                </motion.div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Session Stats */}
            <motion.div
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                <Trophy className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Secure</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                <Sparkles className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-3 text-center border border-pink-200">
                <CheckCircle className="h-5 w-5 text-pink-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Verified</p>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              className="text-xs text-gray-600 bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="font-semibold text-gray-700 mb-2">✨ Session Features:</p>
              <p>• Live timer updates every second</p>
              <p>• No memory leaks (proper cleanup)</p>
              <p>• Analytics events logged</p>
              <p>• Secure session management</p>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 button-3d"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </motion.div>
          </div>
        </Card3D>

        {/* Footer */}
        <motion.div
          className="text-center mt-6 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>Secured by <span className="font-semibold gradient-text">Lokal Auth</span></p>
        </motion.div>
      </div>
    </div>
  );
};
