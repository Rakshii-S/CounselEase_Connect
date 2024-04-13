import React, { useState, useEffect } from 'react';
const MeditationTimer: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(duration);
    setIsRunning(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setDuration(value);
    setTimeRemaining(value);
  };

  return (
    <div className='common-container'>
    <div className='bg-gray-900 w-full h-14 rounded-lg text-center pt-4 text-lg'>
        Mindfulness Meditation Timer
    </div>
      <label>
        Set duration (in seconds):
        <input
          type="number"
          className='bg-gray-800 p-2 pl-4 m-2'
          value={duration}
          onChange={handleInputChange}
          disabled={isRunning}
        />
      </label>
      {!isRunning ? (
        <button className="bg-sky-800 p-4 rounded-xl w-56 h-18" onClick={startTimer}>Start</button>
      ) : (
        <button className="bg-sky-800 p-4 rounded-xl w-56 h-18" onClick={pauseTimer}>Pause</button>
      )}
      <button className="bg-sky-800 p-4 rounded-xl w-56 h-18" onClick={resetTimer}>Reset</button>
      <div>
        Time remaining: {timeRemaining} seconds
      </div>
    </div>
  );
};

export default MeditationTimer;
