import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  // URL for manual search (by city name)
  const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  const backgrounds = {
    Clear: 'url(https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Clouds: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80)',
    Rain: 'url(https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Snow: 'url(https://images.unsplash.com/photo-1477601372959-565a586db71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Thunderstorm: 'url(https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Mist: 'url(https://images.unsplash.com/photo-1543968996-ee822b8176ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Haze: 'url(https://images.unsplash.com/photo-1543968996-ee822b8176ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    Default: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)'
  };

  // ✨ NEW: Auto-detect location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Fetch weather by Coordinates (lat/lon)
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        axios.get(geoUrl).then((response) => {
          setData(response.data);
          console.log("Auto-detected location:", response.data.name);
        }).catch((error) => {
          console.error("Error fetching geolocation data:", error);
        });
      }, (error) => {
        console.log("User denied location access or error occurred.");
      });
    }
  }, []); // Empty dependency array = run once on startup

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(searchUrl).then((response) => {
        setData(response.data);
      }).catch((error) => {
        alert("City not found!");
      });
      setLocation('');
    }
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`
  }

  // Logic to pick background
  let bgImage = backgrounds.Default;
  if (data && data.weather) {
    const weatherType = data.weather[0].main;
    if (backgrounds[weatherType]) {
      bgImage = backgrounds[weatherType];
    }
  }

  return (
    <div className="app" style={{ backgroundImage: bgImage }}>
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      
      {data && (
        <div className="container">
          <div className="top">
            <div className="date">
                <p>{dateBuilder(new Date())}</p>
            </div>
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

      {!data && (
        <div className="container" style={{ justifyContent: 'center', minHeight: '200px' }}>
            <h3>Allow location access<br/>or enter a city 🌤️</h3>
        </div>
      )}
    </div>
  );
}

export default App;