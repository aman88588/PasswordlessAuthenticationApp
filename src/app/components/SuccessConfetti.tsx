import React from 'react';
import { motion } from 'motion/react';

/**
 * Success Confetti Component
 * Animated confetti explosion effect
 */
export const SuccessConfetti: React.FC = () => {
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#FF6B35', '#FFA07A', '#FFD700', '#FF4500', '#FFE5D9'][i % 5],
    size: Math.random() * 8 + 4,
    startX: 50 + (Math.random() - 0.5) * 20,
    endX: (Math.random() - 0.5) * 200,
    endY: Math.random() * -300 - 200,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1.5 + 1,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            left: `${piece.startX}%`,
            top: '50%',
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            x: piece.endX,
            y: piece.endY,
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};
