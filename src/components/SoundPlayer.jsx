import React, { useState, useEffect, useRef } from 'react';

const SoundPlayer = ({ weatherCondition }) => {
  const [isPlaying, setIsPlaying] = useState(false); // Default to muted
  const audioRef = useRef(new Audio());

  // Map weather conditions to your files
  const soundMap = {
    Rain: '/sounds/rain.mp3',
    Drizzle: '/sounds/rain.mp3',
    Thunderstorm: '/sounds/rain.mp3',
    Clouds: '/sounds/clouds.mp3',
    Mist: '/sounds/clouds.mp3',
    Snow: '/sounds/snow.mp3',
    Clear: '/sounds/clear.mp3',
  };

  // Handle Weather Changes
  useEffect(() => {
    if (!weatherCondition) return;

    const soundFile = soundMap[weatherCondition] || soundMap['Clear']; // Fallback
    
    // Only change source if it's different
    if (audioRef.current.src !== window.location.origin + soundFile) {
        audioRef.current.src = soundFile;
        audioRef.current.loop = true; // Loop forever
        
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    }
  }, [weatherCondition]);

  // Handle Play/Pause Toggle
  const toggleSound = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={toggleSound}
      className="sound-button"
      title={isPlaying ? "Mute Sound" : "Play Sound"}
    >
      {isPlaying ? "🔊" : "🔇"}
    </button>
  );
};

export default SoundPlayer;