import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for pull-to-refresh functionality
 * @param {Function} onRefresh - Callback function to execute on refresh
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Distance in px to trigger refresh (default: 80)
 * @param {number} options.horizontalThreshold - Max horizontal movement allowed (default: 30)
 * @returns {Object} - { isRefreshing, pullDistance }
 */
export function usePullToRefresh(onRefresh, options = {}) {
  const { threshold = 80, horizontalThreshold = 30 } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [onRefresh]);

  useEffect(() => {
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isDragging = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || window.scrollY !== 0) {
        isDragging = false;
        setPullDistance(0);
        return;
      }
      
      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      
      const diffY = currentY - startY;
      const diffX = Math.abs(currentX - startX);
      
      // Update visual feedback
      if (diffY > 0 && diffX < horizontalThreshold) {
        setPullDistance(diffY);
      }
      
      // Trigger refresh if threshold met
      if (diffY > threshold && diffX < horizontalThreshold && window.scrollY === 0) {
        handleRefresh();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      setPullDistance(0);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleRefresh, threshold, horizontalThreshold]);

  return { isRefreshing, pullDistance };
}