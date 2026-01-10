import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
      }).catch((error) => {
        alert("City not found!");
      });
      setLocation('');
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location (e.g. Vadodara)"
          type="text"
        />
      </div>
      
      {/* Only show the card if we have data */}
      {data && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              <h1>{data.main.temp.toFixed()}°C</h1>
            </div>
            <div className="description">
              <p>{data.weather[0].main}</p>
            </div>
          </div>

          <div className="bottom">
            <div className="feels">
              <p className='bold'>{data.main.feels_like.toFixed()}°C</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className='bold'>{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className='bold'>{data.wind.speed} MPH</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder message when no data is loaded */}
      {!data && (
        <div className="container" style={{ justifyContent: 'center', minHeight: '200px' }}>
            <h3>Enter a city to see the weather 🌤️</h3>
        </div>
      )}
    </div>
  );
}

export default App;