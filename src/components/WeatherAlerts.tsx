import React from 'react';
import { CloudRain, Wind, Thermometer, Eye } from 'lucide-react';
import { useWeatherData } from '../hooks/useBlueCloudData';

const WeatherAlerts: React.FC = () => {
  const { data: weatherData, loading: weatherLoading } = useWeatherData(41.0, 2.0);

  const alerts = [
    {
      type: 'Storm Warning',
      severity: 'High',
      area: 'Offshore Zone A-12',
      windSpeed: '45 km/h',
      waveHeight: '3.2m',
      visibility: '2 km',
      temperature: '16°C',
      timeToImpact: '4 hours',
      affectedFarms: 3,
      recommendedAction: 'Secure equipment, evacuate personnel'
    },
    {
      type: 'Heavy Seas',
      severity: 'Medium',
      area: 'Coastal Zone B-7',
      windSpeed: '32 km/h',
      waveHeight: '2.1m',
      visibility: '5 km',
      temperature: '18°C',
      timeToImpact: '8 hours',
      affectedFarms: 2,
      recommendedAction: 'Monitor conditions, prepare contingencies'
    },
    {
      type: 'Temperature Drop',
      severity: 'Low',
      area: 'Deep Water Zone C-3',
      windSpeed: '18 km/h',
      waveHeight: '1.5m',
      visibility: '8 km',
      temperature: '14°C',
      timeToImpact: '12 hours',
      affectedFarms: 1,
      recommendedAction: 'Monitor fish behavior, adjust feeding'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'Medium': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Weather & Extreme Event Alerts</h2>
        <p className="text-blue-200">
          Monitor extreme weather using Copernicus Marine Service data
          {weatherLoading && <span className="ml-2 text-orange-300">(Loading weather data...)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CloudRain className="h-6 w-6 text-red-400" />
            <span className="text-white font-semibold">Active Alerts</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">3</div>
          <div className="text-red-300 text-sm">Weather warnings</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wind className="h-6 w-6 text-orange-400" />
            <span className="text-white font-semibold">Max Wind Speed</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">45</div>
          <div className="text-orange-300 text-sm">km/h sustained</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">Min Visibility</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">2</div>
          <div className="text-blue-300 text-sm">kilometers</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className="h-6 w-6 text-cyan-400" />
            <span className="text-white font-semibold">Temperature Range</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">14-18°C</div>
          <div className="text-cyan-300 text-sm">Current conditions</div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weather Alert Details</h3>
        
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <CloudRain className="h-5 w-5 text-blue-400" />
                    <h4 className="text-white font-medium">{alert.type}</h4>
                  </div>
                  <p className="text-blue-200 text-sm mb-1">{alert.area}</p>
                  <p className="text-blue-200 text-sm">Impact in: {alert.timeToImpact}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">{alert.windSpeed}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-orange-400" />
                      <span className="text-white text-sm">{alert.temperature}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 text-sm">Waves:</span>
                      <span className="text-white text-sm">{alert.waveHeight}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-cyan-400" />
                      <span className="text-white text-sm">{alert.visibility}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-white font-medium mb-2">Recommended Action:</p>
                  <p className="text-blue-200 text-sm mb-2">{alert.recommendedAction}</p>
                  <p className="text-blue-300 text-xs cursor-pointer hover:text-blue-200"
                     onClick={() => alert(`Affected Farms Details:\n\n${alert.affectedFarms} farms in impact zone:\n- Farm Alpha (High priority)\n- Coastal Farm Beta (Medium priority)\n${alert.affectedFarms > 2 ? '- Deep Sea Farm Gamma (Low priority)' : ''}\n\nEmergency contacts have been notified.`)}>
                    {alert.affectedFarms} farms affected (click for details)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Response Checklist</h3>
          
          <div className="space-y-3">
            {[
              { task: 'Alert all farm personnel', status: 'Complete', priority: 'Critical' },
              { task: 'Secure floating equipment', status: 'In Progress', priority: 'High' },
              { task: 'Activate emergency beacons', status: 'Ready', priority: 'High' },
              { task: 'Contact coast guard', status: 'Complete', priority: 'Critical' },
              { task: 'Prepare backup generators', status: 'Pending', priority: 'Medium' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{item.task}</p>
                  <p className="text-blue-200 text-sm">Priority: {item.priority}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'Complete' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'In Progress' ? 'bg-orange-500/20 text-orange-400' :
                  item.status === 'Ready' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weather Forecast (48h)</h3>
          
          <div className="space-y-3">
            {[
              { time: 'Next 6h', condition: 'Storm approaching', wind: '45 km/h', waves: '3.2m' },
              { time: 'In 12h', condition: 'Peak conditions', wind: '52 km/h', waves: '4.1m' },
              { time: 'In 24h', condition: 'Conditions improving', wind: '38 km/h', waves: '2.8m' },
              { time: 'In 48h', condition: 'Calm weather', wind: '20 km/h', waves: '1.2m' }
            ].map((forecast, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{forecast.time}</span>
                  <span className="text-blue-200 text-sm">{forecast.condition}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Wind className="h-3 w-3 text-blue-400" />
                    <span className="text-white text-xs">{forecast.wind}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-cyan-400 text-xs">Waves:</span>
                    <span className="text-white text-xs">{forecast.waves}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;