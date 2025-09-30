import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const AlertsPanel: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Oil Spill Risk',
      message: 'High probability detected near Poseidon MPA',
      time: '2 minutes ago',
      status: 'active'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Species Migration',
      message: 'Bluefin tuna populations moving north',
      time: '15 minutes ago',
      status: 'monitoring'
    },
    {
      id: 3,
      type: 'info',
      title: 'Weather Update',
      message: 'Storm system approaching aquaculture zone',
      time: '1 hour ago',
      status: 'active'
    },
    {
      id: 4,
      type: 'resolved',
      title: 'System Maintenance',
      message: 'Glider data synchronization completed',
      time: '2 hours ago',
      status: 'resolved'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-orange-400" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-400/30 bg-red-500/10';
      case 'warning':
        return 'border-orange-400/30 bg-orange-500/10';
      case 'resolved':
        return 'border-green-400/30 bg-green-500/10';
      default:
        return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-sm">3 Critical</span>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${getAlertStyles(alert.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <span className="text-white font-medium text-sm">{alert.title}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.status === 'active' ? 'bg-red-500/20 text-red-300' :
                alert.status === 'monitoring' ? 'bg-orange-500/20 text-orange-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {alert.status}
              </span>
            </div>
            <p className="text-blue-100 text-sm mb-2">{alert.message}</p>
            <div className="flex items-center justify-between">
              <span className="text-blue-300 text-xs">{alert.time}</span>
              <button className="text-blue-400 hover:text-blue-300 text-xs underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default AlertsPanel;