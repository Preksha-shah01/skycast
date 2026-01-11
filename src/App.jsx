import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

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

  // ✨ NEW: Function to format the date
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
            
            {/* ✨ NEW: The Date Display */}
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
            <h3>Enter a city to see the weather 🌤️</h3>
        </div>
      )}
    </div>
  );
}

export default App;