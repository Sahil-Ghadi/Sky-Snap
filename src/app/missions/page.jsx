"use client";

import { useState, useEffect } from "react";
import { FiCrosshair } from "react-icons/fi";

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/missions?search=${encodeURIComponent(searchQuery)}`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMissions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredMissions = missions.filter((mission) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return mission.status.id === 1;
    if (filter === "success") return mission.status.id === 3;
    if (filter === "failed") return mission.status.id === 4;
    return true;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { text: "Upcoming", color: "bg-blue-500/90 text-blue-100" },
      2: { text: "In Flight", color: "bg-yellow-500/90 text-yellow-100" },
      3: { text: "Success", color: "bg-green-500/90 text-green-100" },
      4: { text: "Failed", color: "bg-red-500/90 text-red-100" },
      5: { text: "Partial Failure", color: "bg-orange-500/90 text-orange-100" },
      6: { text: "TBD", color: "bg-purple-500/90 text-purple-100" },
      7: { text: "On Hold", color: "bg-gray-500/90 text-gray-100" },
    };

    const statusInfo = statusMap[status.id] || {
      text: "Unknown",
      color: "bg-gray-500/90 text-gray-100",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} backdrop-blur-sm`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget || e.target.closest(".close-button")) {
      setSelectedMission(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-12 text-center mt-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Missions Tracker
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore launches from NASA, SpaceX, ISRO and other space agencies
            worldwide
          </p>
        </header>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search missions by name, agency or rocket..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm placeholder-gray-500 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "success", "failed"].map((f) => (
              <button
                key={f}
                className={`px-5 py-2.5 rounded-xl capitalize whitespace-nowrap transition-all duration-200 ${
                  filter === f
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm"
                }`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-gray-950"></div>
            </div>
            <p className="text-gray-400">Loading space missions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-xl mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium">Failed to load missions</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                className="group relative bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-purple-500/30 cursor-pointer"
                onClick={() => setSelectedMission(mission)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent z-10 pointer-events-none"></div>
                <div className="h-52 overflow-hidden">
                  <img
                    src={
                      mission.image ||
                      mission.rocket.configuration.image_url ||
                      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    }
                    alt={mission.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative z-20 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {mission.name}
                    </h2>
                    {getStatusBadge(mission.status)}
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm">
                    <span>{mission.launch_service_provider.name}</span>
                    <span className="text-xs">•</span>
                    <span>{formatDate(mission.net)}</span>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2 text-sm">
                    {mission.mission?.description || "No description available"}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-gray-800/70 rounded-lg text-xs backdrop-blur-sm">
                      {mission.rocket.configuration.name}
                    </span>
                    {mission.mission?.orbit && (
                      <span className="px-2.5 py-1 bg-gray-800/70 rounded-lg text-xs backdrop-blur-sm">
                        {mission.mission.orbit.name}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {mission.vidURLs?.[0] && (
                      <a
                        href={mission.vidURLs[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1.5 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                        Watch
                      </a>
                    )}
                    {mission.infoURLs?.[0] && (
                      <a
                        href={mission.infoURLs[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1.5 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        Info
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMissions.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No missions found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're
              looking for.
            </p>
          </div>
        )}
      </div>

      {/* Mission Details Modal */}
      {selectedMission && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={closeModal}
        >
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl animate-scale-in">
            <div className="relative">
              <div className="h-64 md:h-80 w-full overflow-hidden">
                <img
                  src={
                    selectedMission.image ||
                    selectedMission.rocket.configuration.image_url ||
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  }
                  alt={selectedMission.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to modal
                  setSelectedMission(null); // Close directly
                }}
                className="close-button absolute top-4 right-4 bg-gray-900/80 rounded-full p-2 hover:bg-gray-800 transition-colors backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedMission.name}
                </h2>
                {getStatusBadge(selectedMission.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Launch Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-24">Provider:</span>
                        <span>
                          {selectedMission.launch_service_provider.name}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-24">Date:</span>
                        <span>{formatDate(selectedMission.net)}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-24">Rocket:</span>
                        <span>{selectedMission.rocket.configuration.name}</span>
                      </div>
                      {selectedMission.mission?.orbit && (
                        <div className="flex gap-3">
                          <span className="text-gray-500 w-24">Orbit:</span>
                          <span>{selectedMission.mission.orbit.name}</span>
                        </div>
                      )}
                      {selectedMission.pad?.name && (
                        <div className="flex gap-3">
                          <span className="text-gray-500 w-24">
                            Launch Pad:
                          </span>
                          <span>{selectedMission.pad.name}</span>
                        </div>
                      )}
                      {selectedMission.pad?.location?.name && (
                        <div className="flex gap-3">
                          <span className="text-gray-500 w-24">Location:</span>
                          <span>{selectedMission.pad.location.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Mission Details
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedMission.mission?.description ||
                      "No description available"}
                  </p>
                  {selectedMission.mission?.type && (
                    <div className="flex gap-3">
                      <span className="text-gray-500 w-24">Type:</span>
                      <span>{selectedMission.mission.type}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedMission.vidURLs?.map((url, index) => (
                  <a
                    key={index}
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/90 hover:bg-blue-500 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    {index === 0 ? "Watch Launch" : `Video ${index + 1}`}
                  </a>
                ))}

                {selectedMission.infoURLs?.map((url, index) => (
                  <a
                    key={index}
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    {index === 0 ? "More Info" : `Info ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} //button
