import React, { useState } from 'react';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../services/auth';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300';
      case 'operator': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-blue-500/20 text-blue-300';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-blue-400" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-white text-sm font-medium">{user.name}</p>
          <p className="text-blue-200 text-xs">{user.organization}</p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-white/30 shadow-2xl z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-blue-200 text-sm">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-sm">{user.organization}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="p-2">
            <div className="mb-2">
              <p className="text-blue-200 text-xs font-medium px-3 py-2">Permissions</p>
              <div className="space-y-1">
                {user.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2 px-3 py-1">
                    <Shield className="h-3 w-3 text-green-400" />
                    <span className="text-green-300 text-xs">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-2">
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;