"use client"

import { useState, useEffect } from "react";
import { FiMapPin, FiCompass, FiLoader } from "react-icons/fi";

export default function StellarViewer() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLoading(true);
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
        
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      } catch (err) {
        console.error("Location error:", err);
        setError("Couldn't access your location. Showing default view.");
        setLocation({ lat: 0, lng: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  const stellariumUrl = location
    ? `https://stellarium-web.org/?lat=${location.lat}&lng=${location.lng}`
    : "https://stellarium-web.org/";

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Main Content */}
      <main className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse opacity-20"></div>
                <FiLoader className="absolute inset-0 m-auto text-purple-400 w-8 h-8 animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-medium text-gray-100">
                  Locating your position
                </p>
                <p className="text-sm text-gray-400 max-w-xs">
                  {error || "Allow location access for accurate star mapping"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={stellariumUrl}
            className="w-full h-[calc(100vh-72px)]"
            allowFullScreen
            title="Stellarium Star Map"
          />
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gradient-to-t from-gray-900 to-gray-950 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-xs text-gray-500">
            Powered by Stellarium Web • View the night sky in real-time
          </p>
        </div>
      </footer>
    </div>
  );
}