import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const HourlyForecast = ({ data, unit }) => {
  // 1. Format data for the chart
  const chartData = data.slice(0, 8).map(item => {
    return {
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }),
      temp: unit === 'C' 
        ? Math.round(item.main.temp) 
        : Math.round((item.main.temp * 9/5) + 32)
    };
  });

  return (
    <div className="chart-container" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
      <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px' }}>24-Hour Trend</p>
      
      <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#fff', fontSize: 10 }} 
              tickLine={false}
              axisLine={false}
              interval={1} // Show every 2nd label to save space
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '10px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#ffffff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HourlyForecast;