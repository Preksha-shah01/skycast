import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  // ✨ NEW: Loading State
  const [loading, setLoading] = useState(false);
  
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
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

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true); // Start loading
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        axios.get(geoUrl).then((response) => {
          setData(response.data);
          setLoading(false); // Stop loading
        }).catch((error) => {
          console.error(error);
          setLoading(false);
        });
      }, (error) => {
        setLoading(false);
      });
    }
  }, []);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setLoading(true); // Start loading
      axios.get(searchUrl).then((response) => {
        setData(response.data);
        setLoading(false); // Stop loading
      }).catch((error) => {
        alert("City not found!");
        setLoading(false);
      });
      setLocation('');
    }
  };

  // ✨ NEW: Helper to convert timestamp to "6:30 AM"
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  let bgImage = backgrounds.Default;
  if (data && data.weather) {
    const weatherType = data.weather[0].main;
    if (backgrounds[weatherType]) bgImage = backgrounds[weatherType];
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
      
      <div className="container">
        {/* ✨ SHOW LOADER IF LOADING */}
        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        )}

        {/* ✨ SHOW DATA IF NOT LOADING AND DATA EXISTS */}
        {!loading && data && (
          <>
            <div className="top">
              <div className="date"><p>{dateBuilder(new Date())}</p></div>
              <div className="location"><p>{data.name}</p></div>
              <div className="temp"><h1>{data.main.temp.toFixed()}°C</h1></div>
              <div className="description"><p>{data.weather[0].main}</p></div>
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

            {/* ✨ NEW: Sunrise & Sunset Section */}
            <div className="sun-row">
               <div className="sun-box">
                  <span>☀️ Rise:</span>
                  <span className="bold">{formatTime(data.sys.sunrise)}</span>
               </div>
               <div className="sun-box">
                  <span>🌙 Set:</span>
                  <span className="bold">{formatTime(data.sys.sunset)}</span>
               </div>
            </div>
          </>
        )}

        {!loading && !data && (
           <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center'}}>
              <h3>Enter a city 🌤️</h3>
           </div>
        )}
      </div>
    </div>
  );
}

export default App;