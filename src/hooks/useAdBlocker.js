import { useState, useEffect } from 'react';
import { checkAdBlocker } from '../utils/adsense';

export const useAdBlocker = () => {
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        const blocked = await checkAdBlocker();
        setIsAdBlocked(blocked);
      } catch (error) {
        console.error('Error detecting ad blocker:', error);
        setIsAdBlocked(false);
      } finally {
        setIsChecking(false);
      }
    };

    detectAdBlocker();
  }, []);

  return { isAdBlocked, isChecking };
};

