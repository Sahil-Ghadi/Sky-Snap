'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as satellite from 'satellite.js';
import 'leaflet/dist/leaflet.css';

// Dynamic imports
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-900 animate-pulse" /> }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

const DEFAULT_SATELLITE_ID = '25544'; // ISS
const DEFAULT_POSITION = { lat: 0, lng: 0, alt: 0 };
const POPULAR_SATELLITES = [
  { id: '25544', name: 'International Space Station' },
  { id: '20580', name: 'Hubble Telescope' },
  { id: '28654', name: 'NOAA 19' },
  { id: '33591', name: 'SpaceX Falcon 9' },
  { id: '37849', name: 'James Webb Telescope' },
];

export default function SatelliteTrackerPage() {
  const [tle, setTle] = useState([]);
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [satelliteId, setSatelliteId] = useState(DEFAULT_SATELLITE_ID);
  const [satelliteName, setSatelliteName] = useState('International Space Station');
  const [velocity, setVelocity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trail, setTrail] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mapRef = useRef(null);
  const satelliteIconRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/images/marker-icon-2x.png',
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
      });
      satelliteIconRef.current = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3212/3212608.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });
    });
  }, []);

  const fetchTLE = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://celestrak.org/NORAD/elements/gp.php?CATNR=${id}&FORMAT=TLE`
      );
      if (!res.ok) throw new Error('Network response was not ok');
      
      const text = await res.text();
      const lines = text.trim().split('\n');
      
      if (lines.length < 2) {
        throw new Error('No TLE data found for this satellite ID');
      }
      
      setTle(lines);
      setSatelliteName(lines[0].trim());
    } catch (err) {
      setError(err.message);
      setTle([]);
      setPosition(DEFAULT_POSITION);
      setTrail([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePosition = () => {
    if (tle.length < 2) return;

    try {
      const satrec = satellite.twoline2satrec(tle[1], tle[2]);
      const now = new Date();
      const posVel = satellite.propagate(satrec, now);
      
      if (!posVel.position || !posVel.velocity) {
        throw new Error('Invalid position/velocity data');
      }

      const gmst = satellite.gstime(now);
      const geo = satellite.eciToGeodetic(posVel.position, gmst);
      let lat = satellite.degreesLat(geo.latitude);
      let lng = satellite.degreesLong(geo.longitude);
      const alt = geo.height / 1000;

      // Normalize longitude to [-180, 180]
      lng = ((lng + 180) % 360) - 180;
      
      const velocityKmS = Math.sqrt(
        posVel.velocity.x ** 2 + 
        posVel.velocity.y ** 2 + 
        posVel.velocity.z ** 2
      ) / 1000;

      const newPosition = { lat, lng, alt };
      setPosition(newPosition);
      setVelocity(velocityKmS);
      
      setTrail(prev => {
        const newTrail = [...prev, { lat, lng }];
        return newTrail.slice(-100);
      });

      if (mapRef.current) {
        const map = mapRef.current;
        if (!map.getBounds().contains([lat, lng])) {
          map.setView([lat, lng], map.getZoom());
        }
      }
    } catch (err) {
      console.error('Position update error:', err);
      setError(`Position update failed: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!satelliteId.trim()) {
      setError('Please enter a satellite ID');
      return;
    }
    setTrail([]);
    fetchTLE(satelliteId);
  };

  useEffect(() => {
    fetchTLE(DEFAULT_SATELLITE_ID);
  }, []);

  useEffect(() => {
    if (tle.length >= 2) {
      updatePosition();
      const interval = setInterval(updatePosition, 3000);
      return () => clearInterval(interval);
    }
  }, [tle]);

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-950">
        <div className="relative w-24 h-24">
          {/* Animated orbiting planets */}
          <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-4 h-4 rounded-full bg-purple-500 animate-orbit">
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-purple-500/20 animate-pulse"></div>
            </div>
          </div>

          {/* Central planet with craters */}
          <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
            <div className="absolute top-2 left-3 w-1 h-1 rounded-full bg-blue-800/70"></div>
            <div className="absolute bottom-3 right-2 w-2 h-2 rounded-full bg-blue-800/70"></div>
            <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-blue-800/70"></div>
          </div>

          {/* Outer ring with stars */}
          <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 rounded-full border border-gray-700/50 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rounded-full bg-white"></div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xl font-medium text-gray-300">
            Launching Satellite Data
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Establishing connection with NASA</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md p-4 border-b border-gray-800 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Satellite Tracker
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={satelliteId}
                onChange={(e) => setSatelliteId(e.target.value)}
                placeholder="Enter Satellite ID"
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-all"
              />
              {error && (
                <div className="absolute top-full left-0 mt-1 text-red-400 text-xs bg-gray-900 px-2 py-1 rounded">
                  {error}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Tracking...
                </>
              ) : 'Track'}
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`bg-gray-900/80 backdrop-blur-md border-r border-gray-800 h-full overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-0'} absolute md:relative z-20 md:z-0`}>
          <div className={`p-6 ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <h2 className="text-xl font-semibold mb-6 text-blue-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Popular Satellites
            </h2>
            
            <ul className="space-y-2 mb-8">
              {POPULAR_SATELLITES.map((sat) => (
                <li key={sat.id}>
                  <button
                    onClick={() => {
                      setSatelliteId(sat.id);
                      fetchTLE(sat.id);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${satelliteId === sat.id ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    <span className="bg-blue-500/10 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">{sat.name}</p>
                      <p className="text-xs text-gray-400">#{sat.id}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {!isLoading && !error && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 backdrop-blur-sm">
                <h3 className="font-semibold text-lg mb-3 text-blue-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Current Data
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Name</span>
                    <span className="font-medium">{satelliteName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ID</span>
                    <span className="font-mono text-blue-400">#{satelliteId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Latitude</span>
                    <span>{position.lat.toFixed(4)}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Longitude</span>
                    <span>{position.lng.toFixed(4)}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Altitude</span>
                    <span>{position.alt.toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Velocity</span>
                    <span>{velocity.toFixed(2)} km/s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-medium mb-1">Tracking Satellite</h3>
                <p className="text-gray-400">Fetching orbital data for #{satelliteId}</p>
              </div>
            </div>
          )}
          
          <MapContainer
            center={[position.lat || 0, position.lng || 0]}
            zoom={3}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            ref={mapRef}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {trail.length > 1 && (
              <Polyline
                positions={trail}
                color="#3b82f6"
                weight={3}
                opacity={0.8}
              />
            )}
            
            {satelliteIconRef.current && (
              <Marker position={[position.lat || 0, position.lng || 0]} icon={satelliteIconRef.current}>
                <Popup className="rounded-lg shadow-lg">
                  <div className="space-y-2 p-2">
                    <h3 className="font-bold text-lg">{satelliteName}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p className="font-mono">#{satelliteId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Altitude</p>
                        <p>{position.alt.toFixed(2)} km</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Latitude</p>
                        <p>{position.lat.toFixed(4)}°</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Longitude</p>
                        <p>{position.lng.toFixed(4)}°</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Velocity</p>
                        <p>{velocity.toFixed(2)} km/s</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Mini status bar */}
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-10">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-800 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-400">{satelliteName}</h4>
                  <p className="text-sm text-gray-400">ID: #{satelliteId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-gray-400">Last update: </span>
                    {new Date().toLocaleTimeString()}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Status: </span>
                    <span className={`font-medium ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                      {isLoading ? 'Updating...' : 'Active'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
//initailizing