import React from 'react';
import { getDayName, getTemp } from '../utils/helpers';

const ForecastList = ({ forecast, unit }) => {
  return (
    <div className="forecast-section">
      <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px' }}>Next 5 Days</p>
      <div className="forecast-list">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <span className="forecast-day">{getDayName(day.dt_txt)}</span>
            <span className="forecast-desc">{day.weather[0].main}</span>
            <span className="forecast-temp">{getTemp(day.main.temp, unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;