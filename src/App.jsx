import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  
  // State for Unit ('C' or 'F')
  const [unit, setUnit] = useState('C');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const backgrounds = {
    Clear: 'url(https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Clouds: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80)',
    Rain: 'url(https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    // ❄️ Beautiful Snowy Background
    Snow: 'url(https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Thunderstorm: 'url(https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Mist: 'url(https://images.unsplash.com/photo-1543968996-ee822b8176ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Haze: 'url(https://images.unsplash.com/photo-1543968996-ee822b8176ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Default: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)'
  };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('weatherHistory'));
    if (savedHistory) setHistory(savedHistory);
  }, []);

  const addToHistory = (city) => {
    const newHistory = [city, ...history.filter(c => c !== city)].slice(0, 3);
    setHistory(newHistory);
    localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
  };

  const fetchWeather = (lat, lon, city) => {
    setLoading(true);
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${API_KEY}`;

    if (city) {
      weatherUrl += `&q=${city}`;
      forecastUrl += `&q=${city}`;
    } else {
      weatherUrl += `&lat=${lat}&lon=${lon}`;
      forecastUrl += `&lat=${lat}&lon=${lon}`;
    }

    axios.get(weatherUrl).then((response) => {
      setData(response.data);
      if (city) addToHistory(response.data.name);
      return axios.get(forecastUrl);
    }).then((response) => {
      const dailyData = response.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
      setForecast(dailyData);
      setLoading(false);
    }).catch((error) => {
      console.error(error);
      toast.error("City not found!");
      setLoading(false);
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude, null);
      });
    }
  }, []);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      if (!location.trim()) return;
      fetchWeather(null, null, location);
      setLocation('');
    }
  };

  // Helper to convert C to F
  const getTemp = (tempInC) => {
    if (unit === 'C') return `${tempInC.toFixed()}°`;
    const tempInF = (tempInC * 9/5) + 32;
    return `${tempInF.toFixed()}°`;
  };

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  const dateBuilder = (d) => {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: 'short' });
  };

  let bgImage = backgrounds.Default;
  if (data && data.weather) {
    const type = data.weather[0].main;
    if (backgrounds[type]) bgImage = backgrounds[type];
  }

  return (
    <div className="app" style={{ backgroundImage: bgImage }}>
      <Toaster position="top-right" />

      <div className="dashboard">
        
        {loading && <div className="loader-container"><div className="spinner"></div></div>}

        {!loading && data && (
          <>
            {/* 👈 LEFT PANEL: VISUALS */}
            <div className="left-panel">
              <div className="date-container">
                <p>{dateBuilder(new Date())}</p>
                <div className="city-name"><p>{data.name}</p></div>
              </div>
              
              <div className="temp-container">
                 <div className="icon-box">
                   <img 
                     className="weather-icon"
                     src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} 
                     alt="weather icon" 
                   />
                 </div>

                 <div className="main-temp">
                    <h1>{getTemp(data.main.temp)}</h1>
                 </div>
                 
                 <div className="weather-desc">
                    <p>{data.weather[0].main}</p>
                 </div>
              </div>
            </div>

            {/* 👉 RIGHT PANEL: DATA & CONTROLS */}
            <div className="right-panel">
              <div className="search-section">
                <div className="search-box">
                  <input
                    value={location}
                    onChange={event => setLocation(event.target.value)}
                    onKeyPress={searchLocation}
                    placeholder="Change City..."
                    type="text"
                  />
                </div>

                {/* ✨ TOGGLE SWITCH */}
                <div className="toggle-container">
                  <span className="toggle-label" style={{opacity: unit==='C' ? 1 : 0.5}}>°C</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={unit === 'F'} 
                      onChange={toggleUnit} 
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="toggle-label" style={{opacity: unit==='F' ? 1 : 0.5}}>°F</span>
                </div>

                {history.length > 0 && (
                  <div className="history-row">
                    {history.map((city, index) => (
                      <button key={index} className="history-chip" onClick={() => fetchWeather(null, null, city)}>
                        {city} ↺
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="details-grid">
                <div className="detail-card">
                   <span>Humidity</span>
                   <p>{data.main.humidity}%</p>
                </div>
                <div className="detail-card">
                   <span>Wind</span>
                   <p>{data.wind.speed} <small>mph</small></p>
                </div>
                <div className="detail-card">
                   <span>Sunrise</span>
                   <p>{formatTime(data.sys.sunrise)}</p>
                </div>
                <div className="detail-card">
                   <span>Sunset</span>
                   <p>{formatTime(data.sys.sunset)}</p>
                </div>
              </div>

              {forecast.length > 0 && (
                <div className="forecast-section">
                  <p style={{fontSize: '0.9rem', fontWeight: '600', marginBottom:'10px'}}>Next 5 Days</p>
                  <div className="forecast-list">
                    {forecast.map((day, index) => (
                      <div key={index} className="forecast-item">
                        <span className="forecast-day">{getDayName(day.dt_txt)}</span>
                        <span className="forecast-desc">{day.weather[0].main}</span>
                        <span className="forecast-temp">{getTemp(day.main.temp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!loading && !data && (
           <div style={{width:'100%', padding:'3rem', textAlign:'center'}}>
              <h3>Enter a city to start 🌤️</h3>
           </div>
        )}
      </div>
    </div>
  );
}

export default App;