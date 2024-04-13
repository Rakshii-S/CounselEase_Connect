import React, { useState, useEffect } from 'react';
import '../activity/Breathing.css';


const Breathing: React.FC = () => {
  const [breathing, setBreathing] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined; // Initialize as undefined
    if (breathing) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (intervalId !== undefined) { // Check if intervalId is defined before clearing
      clearInterval(intervalId);
      setTimer(0);
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [breathing]);

  const handleStart = () => {
    setBreathing(true);
  };

  const handleStop = () => {
    setBreathing(false);
  };

  return (
    <div className="common-container">
      <h1 className='bg-gray-900 w-full h-14 rounded-lg text-center pt-4 text-lg'>Mindful Breathing</h1>
      <div className="breathing-instructions">
        <p>{breathing ? 'Breathe in' : 'Breathe out'}</p>
      </div>
      <div className="breathing-timer">
        <p>Timer: {timer} seconds</p>
      </div>
      <div className="breathing-buttons">
        <button onClick={handleStart} disabled={breathing}>
          Start
        </button>
        <button onClick={handleStop} disabled={!breathing}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default Breathing;
