import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('London');
  
  // This is how we access the key from your .env file safely
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data); // Check your browser console to see the raw data!
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
          placeholder="Enter Location"
          type="text"
        />
      </div>
      
      <div className="container">
        <div className="top">
          <div className="location">
            {/* Display City Name */}
            <p>{data ? data.name : "Enter a city..."}</p>
          </div>
          <div className="temp">
            {/* Display Temp (if data exists) */}
            {data ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {/* Display Weather Description (e.g. "Clouds") */}
            {data ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data && (
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
        )}
      </div>
    </div>
  );
}
export default App;