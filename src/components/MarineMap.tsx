import React from 'react';

const MarineMap: React.FC = () => {
  return (
    <div className="relative h-64 bg-gradient-to-b from-blue-900/50 to-blue-800/50 rounded-lg border border-blue-400/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 50c25-25 75-25 100 0v50H0V50z%22 fill=%22%23134e4a%22 fill-opacity=%220.3%22/%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Simulated map markers */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg">
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-400/30 rounded-full animate-ping"></div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg">
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-400/30 rounded-full animate-ping"></div>
      </div>
      
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg">
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-cyan-400/30 rounded-full animate-ping"></div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-white">Oil Spill Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-white">Species Alert</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span className="text-white">Aquaculture Farm</span>
          </div>
        </div>
      </div>

      {/* Coordinate display */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <span className="text-white text-xs font-mono">41.2°N, 2.1°E</span>
      </div>
    </div>
  );
};

export default MarineMap;