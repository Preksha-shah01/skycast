import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// ✨ Imports from our new modular files
import { dateBuilder, getTemp } from './utils/helpers';
import WeatherStats from './components/WeatherStats';
import ForecastList from './components/ForecastList';

function App() {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [unit, setUnit] = useState('C');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const backgrounds = {
    Clear: 'url(https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Clouds: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80)',
    Rain: 'url(https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
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

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
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
                    <h1>{getTemp(data.main.temp, unit)}</h1>
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

                <div className="toggle-container">
                  <span className="toggle-label" style={{opacity: unit==='C' ? 1 : 0.5}}>°C</span>
                  <label className="switch">
                    <input type="checkbox" checked={unit === 'F'} onChange={toggleUnit} />
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

              {/* ✨ MODULAR COMPONENTS BEING USED HERE */}
              <WeatherStats data={data} />
              
              {forecast.length > 0 && (
                <ForecastList forecast={forecast} unit={unit} />
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