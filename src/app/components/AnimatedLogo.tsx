import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';

/**
 * Animated Logo Component
 * 3D rotating logo with particles
 */
export const AnimatedLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Rotating Rings */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full border-4 border-orange-400/30`}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full border-4 border-red-400/30 border-dashed`}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center Logo */}
      <motion.div
        className={`${sizeClasses[size]} relative z-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Shield className="w-2/3 h-2/3 text-white" />
        
        {/* Sparkles */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </motion.div>
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full bg-orange-500/20 blur-xl`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
};
