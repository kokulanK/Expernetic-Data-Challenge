import { useState, useEffect } from 'react';
import axios from 'axios';

const StreamAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/stream-alerts/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Prepend new alerts so latest appears first, cap at 10
      setAlerts(prev => {
        const combined = [...response.data.alerts, ...prev];
        // Deduplicate by id
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        return unique.slice(0, 8);
      });
    } catch (err) {
      console.error('Error fetching stream alerts:', err);
    }
  };

  useEffect(() => {
    fetchAlerts(); // Initial load

    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        fetchAlerts();
      }, 5000); // Poll every 5 seconds to simulate streaming alerts
    }

    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">Real-time Stream Alerts</h3>
          <p className="text-xs text-gray-500">Simulating Live Kafka/Redis event monitoring</p>
        </div>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
            isSimulating
              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400'
              : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400'
          }`}
        >
          {isSimulating ? 'Pause Stream' : 'Resume Stream'}
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Waiting for live feed...
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border text-sm flex items-start justify-between gap-3 animate-in slide-in-from-top-2 duration-300 ${
                alert.alert_type === 'PRICE_DROP'
                  ? 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300'
                  : alert.alert_type === 'HIGH_DEMAND'
                  ? 'bg-green-50/50 dark:bg-green-950/10 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 shadow-sm border">
                    {alert.alert_type}
                  </span>
                  <span className="font-medium text-xs opacity-75">{alert.city}</span>
                </div>
                <p className="text-xs font-medium">{alert.message}</p>
              </div>
              <span className="text-[10px] opacity-65 whitespace-nowrap">
                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StreamAlerts;
