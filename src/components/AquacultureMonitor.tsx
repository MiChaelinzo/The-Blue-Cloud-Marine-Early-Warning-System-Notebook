import React from 'react';
import { Anchor, Bug, Thermometer, Waves } from 'lucide-react';

const AquacultureMonitor: React.FC = () => {
  const farms = [
    {
      name: 'Atlantic Salmon Farm Alpha',
      location: '41.234°N, 2.187°E',
      species: 'Atlantic Salmon',
      status: 'Moderate Risk',
      invasiveSpecies: 'Sea Lice detected',
      temperature: '18.5°C',
      waveHeight: '1.2m',
      lastInspection: '2 days ago'
    },
    {
      name: 'Mediterranean Tuna Ranch',
      location: '41.445°N, 2.234°E',
      species: 'Bluefin Tuna',
      status: 'Low Risk',
      invasiveSpecies: 'None detected',
      temperature: '19.2°C',
      waveHeight: '0.8m',
      lastInspection: '1 week ago'
    },
    {
      name: 'Coastal Seabass Farm',
      location: '41.123°N, 2.098°E',
      species: 'European Seabass',
      status: 'High Risk',
      invasiveSpecies: 'Jellyfish swarm nearby',
      temperature: '20.1°C',
      waveHeight: '2.1m',
      lastInspection: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High Risk': return 'text-red-400 bg-red-500/20';
      case 'Moderate Risk': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Offshore Aquaculture Monitoring</h2>
        <p className="text-blue-200">
          Monitor invasive species and weather impacts using Blue-Cloud integrated data
          {farmLoading && <span className="ml-2 text-orange-300">(Loading farm data...)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Anchor className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">Active Farms</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">15</div>
          <div className="text-blue-300 text-sm">Currently monitored</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bug className="h-6 w-6 text-red-400" />
            <span className="text-white font-semibold">Invasive Species</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">3</div>
          <div className="text-red-300 text-sm">Active threats detected</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className="h-6 w-6 text-orange-400" />
            <span className="text-white font-semibold">Avg Temperature</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">19.3°C</div>
          <div className="text-orange-300 text-sm">+1.2°C from normal</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Waves className="h-6 w-6 text-cyan-400" />
            <span className="text-white font-semibold">Sea Conditions</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">1.4m</div>
          <div className="text-cyan-300 text-sm">Average wave height</div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Farm Status Overview</h3>
        
        <div className="space-y-4">
          {farms.map((farm, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <Anchor className="h-5 w-5 text-blue-400" />
                    <h4 className="text-white font-medium">{farm.name}</h4>
                  </div>
                  <p className="text-blue-200 text-sm mb-1">{farm.species}</p>
                  <p className="text-blue-300 text-xs">{farm.location}</p>
                </div>
                
                <div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-orange-400" />
                      <span className="text-white text-sm">{farm.temperature}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Waves className="h-4 w-4 text-cyan-400" />
                      <span className="text-white text-sm">{farm.waveHeight}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(farm.status)}`}>
                    {farm.status}
                  </span>
                  <p className="text-blue-200 text-xs mt-2">Last check: {farm.lastInspection}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Bug className="h-4 w-4 text-red-400" />
                  <span className="text-white text-sm">Invasive Species Status:</span>
                  <span className={`text-sm ${farm.invasiveSpecies === 'None detected' ? 'text-green-400' : 'text-red-400'}`}>
                    {farm.invasiveSpecies}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Invasive Species Threats</h3>
          
          <div className="space-y-3">
            {[
              { species: 'Sea Lice', farms: 2, severity: 'High', trend: 'Increasing' },
              { species: 'Jellyfish Blooms', farms: 1, severity: 'Medium', trend: 'Stable' },
              { species: 'Algae Infestation', farms: 1, severity: 'Low', trend: 'Decreasing' }
            ].map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bug className="h-4 w-4 text-red-400" />
                  <div>
                    <p className="text-white font-medium">{threat.species}</p>
                    <p className="text-blue-200 text-sm">{threat.farms} farms affected</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    threat.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                    threat.severity === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {threat.severity}
                  </span>
                  <p className="text-blue-200 text-xs mt-1">{threat.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mitigation Strategies</h3>
          
          <div className="space-y-3">
            {[
              'Deploy anti-sea lice treatments at Farm Alpha',
              'Install jellyfish barriers around Seabass Farm',
              'Increase monitoring frequency during algae season',
              'Coordinate with nearby farms for synchronized treatments',
              'Update biosecurity protocols for all operations'
            ].map((strategy, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white text-sm">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AquacultureMonitor;