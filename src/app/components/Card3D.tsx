import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Card3DProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * 3D Animated Card Component
 * Card with tilt effect on mouse move
 */
export const Card3D: React.FC<Card3DProps> = ({ children, title, description, className = '' }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <Card className="relative overflow-hidden shadow-2xl border-2 border-orange-100 bg-white/95 backdrop-blur-sm">
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${rotateY * 5 + 50}% ${rotateX * 5 + 50}%, rgba(255, 107, 53, 0.1), transparent 60%)`,
              pointerEvents: 'none',
            }}
          />
          
          {/* 3D Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-lg blur-xl -z-10" />

          {title || description ? (
            <CardHeader className="space-y-1 relative z-10">
              {title && (
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="text-center">{description}</CardDescription>
              )}
            </CardHeader>
          ) : null}
          
          <CardContent className="relative z-10">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
