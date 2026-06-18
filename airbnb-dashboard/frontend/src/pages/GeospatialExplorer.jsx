import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically update map view
const MapController = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const GeospatialExplorer = () => {
  const [mapCenter, setMapCenter] = useState([35.0, -37.0]); // Mid-Atlantic default to show both
  const [mapZoom, setMapZoom] = useState(3);

  const marketData = [
    { city: 'London', coords: [51.5074, -0.1278], avgPrice: 145.20, demandScore: 88 },
    { city: 'New York', coords: [40.7128, -74.0060], avgPrice: 185.50, demandScore: 94 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-8 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Geospatial Market Explorer</h2>
          <p className="text-gray-500 mt-2">Interactive analysis of market dynamics, average pricing, and demand density across supported cities.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setMapCenter([51.5074, -0.1278]); setMapZoom(11); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            Focus London
          </button>
          <button 
            onClick={() => { setMapCenter([40.7128, -74.0060]); setMapZoom(11); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            Focus New York
          </button>
          <button 
            onClick={() => { setMapCenter([35.0, -37.0]); setMapZoom(3); }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium shadow-sm transition-all"
          >
            Reset View
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative z-0">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />
          {marketData.map((market, idx) => (
            <CircleMarker
              key={idx}
              center={market.coords}
              radius={market.demandScore / 4}
              fillColor={market.avgPrice > 150 ? '#EF4444' : '#2563EB'}
              color="white"
              weight={2}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="text-center font-sans">
                  <h3 className="font-bold text-gray-800">{market.city}</h3>
                  <p className="text-sm text-gray-600 mt-1">Avg Price: <span className="font-semibold">${market.avgPrice}</span></p>
                  <p className="text-sm text-gray-600">Demand Score: <span className="font-semibold">{market.demandScore}/100</span></p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* Map Legend Overlay */}
        <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-[1000]">
          <h4 className="font-semibold text-sm mb-2">Legend</h4>
          <div className="space-y-2 text-xs">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
               <span>High Price (&gt;$150)</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-600 opacity-70"></div>
               <span>Moderate Price (&lt;$150)</span>
             </div>
             <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
               Size = Demand Score
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialExplorer;
