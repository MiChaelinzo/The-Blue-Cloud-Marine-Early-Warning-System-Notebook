import React from 'react';
import { TrendingUp, AlertTriangle, Fish, Droplets, Waves, MapPin } from 'lucide-react';
import { useOceanographicData } from '../hooks/useBlueCloudData';
import MetricCard from './MetricCard';
import MarineMap from './MarineMap';
import DataChart from './DataChart';

const Dashboard: React.FC = () => {
  // Use real Blue-Cloud data
  const { data: oceanData, loading, error } = useOceanographicData('41.0,2.0,42.0,3.0', '24h');

  const metrics = [
    {
      title: 'Active Alerts',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
    {
      title: 'Species Migrations',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Fish,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
    },
    {
      title: 'Oil Spill Risks',
      value: '3',
      change: '-1',
      trend: 'down',
      icon: Droplets,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    {
      title: 'Sea Conditions',
      value: 'Moderate',
      change: 'Stable',
      trend: 'stable',
      icon: Waves,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Marine Monitoring Dashboard</h2>
        <p className="text-blue-200">
          Insights from Blue-Cloud VLabs datasets and Virtual Laboratories
          {loading && <span className="ml-2 text-orange-300">(Loading live data...)</span>}
          {error && <span className="ml-2 text-red-300">(Using demonstration data)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Marine Activity Map</h3>
            <MapPin className="h-5 w-5 text-blue-400" />
          </div>
          <MarineMap />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Ocean Temperature Trends</h3>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <DataChart />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity Feed</h3>
        <div className="space-y-3">
          {[
            { time: '14:32', event: 'Oil spill risk detected near Marine Protected Area', severity: 'high' },
            { time: '13:45', event: 'Tuna migration pattern shifted 15km southeast', severity: 'medium' },
            { time: '12:18', event: 'Extreme weather alert for offshore aquaculture farms', severity: 'high' },
            { time: '11:22', event: 'Invasive species detected in coastal monitoring zone', severity: 'medium' },
            { time: '10:15', event: 'Glider data indicates unusual circulation patterns', severity: 'low' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${
                  activity.severity === 'high' ? 'bg-red-400' :
                  activity.severity === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-white text-sm">{activity.event}</span>
              </div>
              <span className="text-blue-200 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;