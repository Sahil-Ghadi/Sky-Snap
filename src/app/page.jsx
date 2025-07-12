'use client'
import LogoLottie from "@/components/LogoLottie";
import {
  Rocket,
  Globe,
  Brain,
  Star,
  Telescope,
  Satellite,
  Moon,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  const features = [
    {
      icon: Globe,
      title: "Discover the Satellites",
      description:
        "Explore breathtaking images of galaxies, nebulae, and cosmic phenomena from across the universe.",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Moon,
      title: "Explore Stars and Planets",
      description:
        "Journey through our solar system and beyond. Learn about planets, moons, and their unique characteristics.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Rocket,
      title: "Track Space Launches",
      description:
        "Stay updated with real-time information about upcoming rocket launches and space missions worldwide.",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Brain,
      title: "Space Quizzes",
      description:
        "Challenge your astronomical knowledge with interactive quizzes and become a space expert.",
      color: "from-green-500 to-teal-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Cosmic Images" },
    { number: "50+", label: "Planets Explored" },
    { number: "200+", label: "Launches Tracked" },
    { number: "1000+", label: "Quiz Questions" },
  ];

  return (
    <div className={`min-h-screen bg-gray-950 text-white overflow-hidden `}>
      <div className="stars" />
      <div className="twinkling" />
      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center px-6`}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-black opacity-90"></div>
        <div className="absolute inset-0">
          <div className="stars absolute inset-0"></div>
        </div>

        <div className="relative z-10 text-center p-4 max-w-3xl mx-auto mb-16">
          <div className="flex">
          <LogoLottie/>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            Dive Into The Space With Skysnap
          </h1>
          </div>

          <p
            className="text-xl md:text-2xl text-gray-300 mb-7 max-w-6xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Explore stars, track space launches, and challenge your knowledge
            with quizzes in the ultimate space exploration experience.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/missions">
            <button className="bg-gradient-to-r lg:w-[250px] from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3 rounded-2xl text-white justify-center flex items-center transition-colors">
              <Rocket className="mr-2 h-5 w-5" />
              Start Exploring
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore the Universe
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the wonders of space with our comprehensive suite of
              astronomical tools and educational content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-lg transition-all duration-300 hover:transform hover:scale-105 group p-8"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-gray-950 to-gray-900 px-6"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <Satellite className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Gateway to Space
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              SkySnap brings the infinite beauty and mystery of space to your
              fingertips. Whether you're a curious beginner or a seasoned
              astronomy enthusiast, our platform offers an immersive journey
              through the cosmos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
              <p className="text-gray-400 text-sm">
                Live updates from space agencies worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn & Grow</h3>
              <p className="text-gray-400 text-sm">
                Interactive learning experiences
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-gray-400 text-sm">
                Connect with fellow space enthusiasts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Explore?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of space enthusiasts discovering the wonders of the
            universe. Your cosmic journey starts here.
          </p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-md font-semibold flex items-center mx-auto transition-colors">
            Launch Your Journey
            <Rocket className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Telescope className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SkySnap
              </span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>
                &copy; 2024 SkySnap. Exploring the cosmos, one snap at a time.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
