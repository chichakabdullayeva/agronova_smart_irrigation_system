import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import SensorCard from '../components/dashboard/SensorCard';
import PumpStatus from '../components/dashboard/PumpStatus';
import SolarStatus from '../components/dashboard/SolarStatus';
import WaterTankGauge from '../components/dashboard/WaterTankGauge';
import Loader from '../components/common/Loader';
import { Droplets, Thermometer, Cloud, Activity } from 'lucide-react';
import { sensorAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchLatestData();

    // Listen for real-time updates
    socket?.on('sensor_update', handleSensorUpdate);

    return () => {
      socket?.off('sensor_update', handleSensorUpdate);
    };
  }, [socket]);

  const handleSensorUpdate = (data) => {
    setSensorData(data);
  };

  const fetchLatestData = async () => {
    try {
      const response = await sensorAPI.getLatest();
      setSensorData(response.data.data);
    } catch (error) {
      toast.error('Failed to load sensor data');
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar title="Dashboard" />
        <div className="p-8 mt-16">
          {/* Sensor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SensorCard
              icon={Droplets}
              title="Soil Moisture"
              value={sensorData?.soilMoisture || 0}
              unit="%"
              type="moisture"
            />
            <SensorCard
              icon={Thermometer}
              title="Temperature"
              value={sensorData?.temperature || 0}
              unit="°C"
              type="temperature"
            />
            <SensorCard
              icon={Cloud}
              title="Humidity"
              value={sensorData?.humidity || 0}
              unit="%"
            />
            <SensorCard
              icon={Activity}
              title="Battery Level"
              value={sensorData?.batteryLevel || 0}
              unit="%"
            />
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WaterTankGauge level={sensorData?.waterTankLevel || 0} />
            <PumpStatus status={sensorData?.pumpStatus || 'OFF'} />
            <SolarStatus
              status={sensorData?.solarPanelStatus || 'INACTIVE'}
              angle={sensorData?.solarPanelAngle || 0}
              batteryLevel={sensorData?.batteryLevel || 0}
            />
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              🌱 System Status: Active
            </h3>
            <p className="text-primary-700">
              All sensors are operational and transmitting data in real-time. 
              Last updated: {sensorData ? new Date(sensorData.timestamp).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
