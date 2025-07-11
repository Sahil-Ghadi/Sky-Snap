"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCompass, FiMapPin, FiMenu, FiX, FiAward } from "react-icons/fi";
import { Telescope } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => setIsOpen(false);

  // Track scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to check if current path matches link
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-1 border-blue-400 ${
      isScrolled ? "bg-gray-900/95 backdrop-blur-md border-b " : "bg-gray-900/80 backdrop-blur-md"
    }`}>
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
            onClick={closeMobileMenu}
          >
              <Telescope className="h-6 w-6 text-blue-400" />
              <span className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ${
                isActive("/") ? "" : ""
              }`}>
                SkySnap
              </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/quiz"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors duration-200 hover:bg-gray-800/50 ${
                isActive("/quiz") ? "text-purple-400" : "text-gray-300 hover:text-white"
              }`}
            >
              <FiAward className={`mr-2 transition-colors duration-200 ${
                isActive("/quiz") ? "text-purple-400" : "text-blue-400 group-hover:text-blue-300"
              }`} />
              <span>Space Quiz</span>
            </Link>
            <Link
              href="/missions"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors duration-200 hover:bg-gray-800/50 ${
                isActive("/missions") ? "text-purple-400" : "text-gray-300 hover:text-white"
              }`}
            >
              <FiCompass className={`mr-2 transition-colors duration-200 ${
                isActive("/missions") ? "text-purple-400" : "text-blue-400 group-hover:text-blue-300"
              }`} />
              <span>Missions Tracker</span>
            </Link>
            <Link
              href="/star-tracker"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors duration-200 hover:bg-gray-800/50 ${
                isActive("/star-tracker") ? "text-purple-400" : "text-gray-300 hover:text-white"
              }`}
            >
              <FiMapPin className={`mr-2 transition-colors duration-200 ${
                isActive("/star-tracker") ? "text-purple-400" : "text-purple-400 group-hover:text-purple-300"
              }`} />
              <span>Stars Tracker</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-label="Main menu"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/missions"
            onClick={closeMobileMenu}
            className={`flex items-center px-3 py-3 text-base font-medium rounded-md hover:text-white hover:bg-gray-800/50 w-full ${
              isActive("/missions") ? "text-purple-400" : "text-gray-300"
            }`}
          >
            <FiCompass className={`mr-3 ${
              isActive("/missions") ? "text-purple-400" : "text-blue-400"
            }`} />
            Missions
          </Link>
          <Link
            href="/star-tracker"
            onClick={closeMobileMenu}
            className={`flex items-center px-3 py-3 text-base font-medium rounded-md hover:text-white hover:bg-gray-800/50 w-full ${
              isActive("/star-tracker") ? "text-purple-400" : "text-gray-300"
            }`}
          >
            <FiMapPin className={`mr-3 ${
              isActive("/star-tracker") ? "text-purple-400" : "text-purple-400"
            }`} />
            Star Tracker
          </Link>
          <Link
            href="/quiz"
            onClick={closeMobileMenu}
            className={`flex items-center px-3 py-3 text-base font-medium rounded-md hover:text-white hover:bg-gray-800/50 w-full ${
              isActive("/quiz") ? "text-purple-400" : "text-gray-300"
            }`}
          >
            <FiAward className={`mr-3 ${
              isActive("/quiz") ? "text-purple-400" : "text-blue-400"
            }`} />
            Space Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
}