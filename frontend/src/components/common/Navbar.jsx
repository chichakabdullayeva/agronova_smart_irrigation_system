import React, { useState, useEffect } from 'react';
import { Bell, User, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { alertAPI } from '../../services/api';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const { connected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadAlerts();
  }, []);

  const fetchUnreadAlerts = async () => {
    try {
      const response = await alertAPI.getAll();
      const unread = response.data.data.filter(alert => !alert.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {connected ? (
            <>
              <Wifi className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600 font-medium">Offline</span>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(user?.name)} flex items-center justify-center`}>
            <span className="text-white font-medium text-sm">
              {getInitials(user?.name || 'User')}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.region || 'Farmer'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
