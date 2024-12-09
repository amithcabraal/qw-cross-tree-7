import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  onTimeChange?: (timeLeft: number) => void;
  isPaused?: boolean;
}

const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  onTimeChange,
  isPaused = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  const updateTimer = useCallback(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    if (!isPaused) {
      const newTime = timeLeft - 1;
      setTimeLeft(newTime);
      onTimeChange?.(newTime);
    }
  }, [timeLeft, onTimeUp, onTimeChange, isPaused]);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div 
      className={`
        text-lg sm:text-xl md:text-2xl font-mono font-bold
        ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-700'}
        ${timeLeft <= 10 && 'animate-pulse'}
      `}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default Timer;