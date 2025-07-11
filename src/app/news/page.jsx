"use client";

import { useState, useEffect } from "react";
import { FiBookOpen } from "react-icons/fi";

export default function SpaceNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
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
            Launching Space News
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Establishing connection with NASA</span>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 mt-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 inline-block">
            Latest News
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stay updated with the most recent discoveries and missions from
            across the cosmos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-700 hover:border-gray-600"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    article.urlToImage ||
                    "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  }
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>

              <div className="p-5">
                <div className="flex items-center mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full">
                    {article.source?.name || "Space News"}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-3 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-gray-400 mb-5 line-clamp-3">
                  {article.description}
                </p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all font-medium group"
                >
                  Read Article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
