import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import StreamAlerts from '../components/StreamAlerts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/analytics/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // removed download logic

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const kpis = data?.kpis || { total_predictions: 0, avg_price: 0, max_price: 0, min_price: 0 };
  const charts = data?.charts || { city_performance: [], property_types: [], room_types: [] };

  const cityPerformanceData = charts.city_performance.length > 0 
    ? charts.city_performance 
    : [
        { city: 'London', count: 0, avg_price: 0 },
        { city: 'New York', count: 0, avg_price: 0 }
      ];

  const propertyTypeData = charts.property_types.length > 0
    ? charts.property_types
    : [
        { property_type: 'Apartment', count: 0 },
        { property_type: 'House', count: 0 },
        { property_type: 'Condo', count: 0 },
        { property_type: 'Other', count: 0 }
      ];

  const roomTypeData = charts.room_types.length > 0
    ? charts.room_types
    : [
        { room_type: 'Entire home/apt', count: 0 },
        { room_type: 'Private room', count: 0 },
        { room_type: 'Shared room', count: 0 },
        { room_type: 'Hotel room', count: 0 }
      ];

  const hasData = kpis.total_predictions > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time statistics compiled from your prediction history.</p>
        </div>
      </div>

      {!hasData && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 p-6 rounded-2xl text-blue-700 dark:text-blue-300">
          <h4 className="font-bold text-lg mb-1">Welcome to Airbnb Intelligence!</h4>
          <p className="text-sm">You haven't run any predictions yet. Head over to the <Link to="/predict" className="font-semibold underline">Predict tab</Link> to estimate some nightly rates and unlock active dashboard analytics.</p>
        </div>
      )}
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Predictions', value: kpis.total_predictions, desc: 'Your calculated prices' },
          { title: 'Average Price', value: `$${kpis.avg_price.toFixed(2)}`, desc: 'Across London & NY' },
          { title: 'Highest Prediction', value: `$${kpis.max_price.toFixed(2)}`, desc: 'Max calculated rate' },
          { title: 'Lowest Prediction', value: `$${kpis.min_price.toFixed(2)}`, desc: 'Min calculated rate' }
        ].map((kpi, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="tracking-tight text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</h3>
            <div className="mt-2 text-3xl font-extrabold text-primary">
              {kpi.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* City Performance */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm col-span-4 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">City Performance Matrix</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="city" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#2563EB" name="Avg Price ($)" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" name="Volume" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar yAxisId="left" dataKey="avg_price" fill="#2563EB" name="Average Price ($)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="count" fill="#10B981" name="Predictions Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm col-span-3 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-4">Room Type Splits</h3>
          <div className="flex-1 h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="room_type"
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            {roomTypeData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate text-gray-600 dark:text-gray-400 font-medium">{item.room_type}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm col-span-4">
          <h3 className="text-lg font-bold mb-4">Property Type Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="property_type" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#8B5CF6" name="Count" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Stream Alerts */}
        <div className="col-span-3">
          <StreamAlerts />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
