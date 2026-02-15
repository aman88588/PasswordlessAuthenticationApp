import React from 'react';
import { motion } from 'motion/react';

/**
 * Floating Particles Component
 * Creates animated floating elements in the background
 */
export const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-orange-400 to-red-400 opacity-40"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            bottom: -20,
          }}
          animate={{
            y: [-20, -window.innerHeight - 100],
            x: [0, Math.sin(particle.id) * 100],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};
