import React from 'react';
import { formatTime } from '../utils/helpers';

const WeatherStats = ({ data }) => {
  return (
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
  );
};

export default WeatherStats;