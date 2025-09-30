import React from 'react';
import { Waves, Shield, Fish, Droplets, Anchor, CloudRain, BookOpen } from 'lucide-react';
import UserProfile from './UserProfile';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Waves },
    { id: 'species', label: 'Species Migration', icon: Fish },
    { id: 'oil-spill', label: 'Oil Spill Monitor', icon: Droplets },
    { id: 'aquaculture', label: 'Aquaculture', icon: Anchor },
    { id: 'weather', label: 'Weather Alerts', icon: CloudRain },
    { id: 'notebook', label: 'Notebook', icon: BookOpen },
  ];

  return (
    <header className="relative z-20 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Blue-Cloud</h1>
              <p className="text-xs text-blue-200">Marine Early Warning System</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-blue-500/30 text-white border border-blue-400/50'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live Data</span>
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;