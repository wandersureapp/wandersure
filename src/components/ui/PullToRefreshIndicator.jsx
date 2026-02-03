import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefreshIndicator({ pullDistance, isRefreshing }) {
  const opacity = Math.min(pullDistance / 80, 1);
  const rotation = (pullDistance / 80) * 360;
  
  return (
    <motion.div
      className="fixed top-16 left-0 right-0 flex justify-center pointer-events-none z-50"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        opacity,
        transform: `translateY(${Math.min(pullDistance - 20, 60)}px)`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border-2 border-blue-500">
        <RefreshCw 
          className={`w-6 h-6 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ transform: isRefreshing ? undefined : `rotate(${rotation}deg)` }}
        />
      </div>
    </motion.div>
  );
}