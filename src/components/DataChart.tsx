import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useOceanographicData } from '../hooks/useBlueCloudData';

const DataChart: React.FC = () => {
  const { data: oceanData, loading } = useOceanographicData('41.0,2.0,42.0,3.0', '24h');
  
  // Transform real data or use fallback
  const chartData = oceanData.length > 0 
    ? oceanData.slice(0, 7).map((point, index) => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        temperature: point.temperature,
        salinity: point.salinity
      }))
    : [
    { time: '00:00', temperature: 18.5, salinity: 35.2 },
    { time: '04:00', temperature: 18.3, salinity: 35.1 },
    { time: '08:00', temperature: 19.1, salinity: 35.3 },
    { time: '12:00', temperature: 20.2, salinity: 35.4 },
    { time: '16:00', temperature: 20.8, salinity: 35.5 },
    { time: '20:00', temperature: 19.9, salinity: 35.3 },
    { time: '24:00', temperature: 19.2, salinity: 35.2 },
  ];

  return (
    <div className="h-64">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-blue-300 text-sm">Loading Blue-Cloud oceanographic data...</div>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#06b6d4" 
            strokeWidth={2}
            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;