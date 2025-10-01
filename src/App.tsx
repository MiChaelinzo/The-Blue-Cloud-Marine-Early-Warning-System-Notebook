import React, { useState } from 'react';
import { useAuth } from './services/auth';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AlertsPanel from './components/AlertsPanel';
import SpeciesMigration from './components/SpeciesMigration';
import OilSpillMonitor from './components/OilSpillMonitor';
import AquacultureMonitor from './components/AquacultureMonitor';
import WeatherAlerts from './components/WeatherAlerts';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Loading Blue-Cloud Services...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'species':
        return <SpeciesMigration />;
      case 'oil-spill':
        return <OilSpillMonitor />;
      case 'aquaculture':
        return <AquacultureMonitor />;
      case 'weather':
        return <WeatherAlerts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;