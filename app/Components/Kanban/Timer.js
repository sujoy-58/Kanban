import React, { useState, useEffect } from "react";
import { FiPlay, FiPause, FiRotateCcw, FiClock } from "react-icons/fi";

const Timer = ({ timer, onTimerUpdate, taskId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(timer?.isRunning || false);
    setCurrentTime(timer?.totalTime || 0);
  }, [timer]);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-save time every 10 seconds when active
  useEffect(() => {
    if (isActive) {
      const saveInterval = setInterval(() => {
        onTimerUpdate({
          isRunning: true,
          startTime: new Date().toISOString(),
          totalTime: currentTime
        });
      }, 10000);
      
      return () => clearInterval(saveInterval);
    }
  }, [isActive, currentTime, onTimerUpdate]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      onTimerUpdate({
        isRunning: false,
        startTime: null,
        totalTime: currentTime
      });
    } else {
      setIsActive(true);
      onTimerUpdate({
        isRunning: true,
        startTime: new Date().toISOString(),
        totalTime: currentTime
      });
    }
  };

  const handleReset = () => {
    if (currentTime === 0) return;
    
    setIsActive(false);
    setCurrentTime(0);
    onTimerUpdate({
      isRunning: false,
      startTime: null,
      totalTime: 0
    });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPomodoroSession = () => {
    return Math.floor(currentTime / 1500) + 1;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
      {/* Timer Display */}
      <div className="flex items-center gap-3 flex-1">
        {/* Clock Icon */}
        <div className={`p-2 rounded-full ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
          <FiClock size={16} />
        </div>

        {/* Timer and Session in a clean layout */}
        <div className="flex items-center gap-4 flex-1">
          <div className="text-lg font-mono font-semibold text-white">
            {formatTime(currentTime)}
          </div>
          
          {/* Session Display - Always visible, elegant placement */}
          <div className="flex items-center gap-2">
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1">
              {/* <span className="text-xs text-white/40">Session</span> */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                currentTime > 0 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-white/5 text-white/30 border border-white/10'
              }`}>
                {getPomodoroSession()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 ml-2">
        {/* Play/Pause Button */}
        <button
          onClick={toggleTimer}
          className={`p-2 rounded-full transition-all duration-200 ${
            isActive 
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
          title={isActive ? "Pause" : "Start"}
        >
          {isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
        </button>

        {/* Reset Button - Always visible */}
        <button
          onClick={handleReset}
          disabled={currentTime === 0}
          className={`p-2 rounded-full transition-all duration-200 ${
            currentTime === 0
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          }`}
          title={currentTime === 0 ? "No time to reset" : "Reset"}
        >
          <FiRotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export default Timer;