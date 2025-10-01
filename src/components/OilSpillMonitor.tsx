import React from 'react';
import { Droplets, Shield, AlertTriangle, Wind } from 'lucide-react';

const OilSpillMonitor: React.FC = () => {
  const risks = [
    {
      id: 'MPA-001',
      location: 'Poseidon Marine Sanctuary',
      riskLevel: 'High',
      distance: '2.3 km',
      source: 'Tanker Route Alpha',
      windDirection: 'SW',
      currentSpeed: '1.2 m/s',
      estimatedImpact: '6 hours'
    },
    {
      id: 'MPA-002',
      location: 'Neptune Coastal Reserve',
      riskLevel: 'Medium',
      distance: '8.7 km',
      source: 'Commercial Shipping',
      windDirection: 'NE',
      currentSpeed: '0.8 m/s',
      estimatedImpact: '12 hours'
    },
    {
      id: 'MPA-003',
      location: 'Triton Deep Sea Park',
      riskLevel: 'Low',
      distance: '15.2 km',
      source: 'Fishing Fleet',
      windDirection: 'N',
      currentSpeed: '0.5 m/s',
      estimatedImpact: '24+ hours'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'Medium': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      default: return 'text-green-400 bg-green-500/20 border-green-400/30';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Oil Spill Risk Assessment</h2>
        <p className="text-blue-200">Monitor potential impacts on Marine Protected Areas and coastal zones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <span className="text-white font-semibold">High Risk Areas</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">3</div>
          <div className="text-red-300 text-sm">Require immediate attention</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">Protected Areas</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">12</div>
          <div className="text-blue-300 text-sm">Under monitoring</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Droplets className="h-6 w-6 text-cyan-400" />
            <span className="text-white font-semibold">Active Simulations</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">8</div>
          <div className="text-cyan-300 text-sm">Real-time modeling</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wind className="h-6 w-6 text-green-400" />
            <span className="text-white font-semibold">Weather Factor</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">SW</div>
          <div className="text-green-300 text-sm">15 km/h winds</div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment Matrix</h3>
        
        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.id} className={`border rounded-lg p-4 ${getRiskColor(risk.riskLevel)}`}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h4 className="text-white font-medium">{risk.location}</h4>
                  </div>
                  <p className="text-blue-200 text-sm">ID: {risk.id}</p>
                  <p className="text-blue-200 text-sm">Source: {risk.source}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-white font-medium">{risk.distance}</p>
                  <p className="text-blue-200 text-sm">Distance</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Wind className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium">{risk.windDirection}</span>
                  </div>
                  <p className="text-blue-200 text-sm">{risk.currentSpeed}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-white font-medium">{risk.estimatedImpact}</p>
                  <p className="text-blue-200 text-sm">Est. Impact Time</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Response Protocols</h3>
          
          <div className="space-y-3">
            {[
              { action: 'Deploy containment booms', status: 'Ready', priority: 'High' },
              { action: 'Alert coastal authorities', status: 'Active', priority: 'High' },
              { action: 'Activate cleanup crews', status: 'Standby', priority: 'Medium' },
              { action: 'Notify wildlife rescuers', status: 'Ready', priority: 'Medium' }
            ].map((protocol, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{protocol.action}</p>
                  <p className="text-blue-200 text-sm">Priority: {protocol.priority}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  protocol.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                  protocol.status === 'Ready' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {protocol.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Environmental Impact Forecast</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                <span className="text-red-400 font-medium">Critical Ecosystem</span>
              </div>
              <p className="text-white text-sm">Coral reef system at 85% vulnerability</p>
            </div>
            
            <div className="p-4 bg-orange-500/10 border border-orange-400/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 bg-orange-400 rounded-full"></div>
                <span className="text-orange-400 font-medium">Marine Wildlife</span>
              </div>
              <p className="text-white text-sm">Seabird nesting areas under moderate threat</p>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400 font-medium">Coastal Communities</span>
              </div>
              <p className="text-white text-sm">3 fishing villages in potential impact zone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OilSpillMonitor;