"use client";

import { Orbitron } from "next/font/google";
import PlanetLottie from "@/components/PlanetLottie";
import RocketLottie from "@/components/RocketLottie";
import { useEffect, useState } from "react";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // adjust weights you want
});
export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      setQuestions(data.quiz || []);
    };

    fetchData();
  }, []);

  const current = questions[currentIndex];

  const handleOptionClick = (option) => {
    setSelected(option);
    setShowNext(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowNext(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!current)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-gray-950"></div>
        </div>
        <p className="text-gray-400">Loading Quiz...</p>
      </div>
    );

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center justify-center p-4 text-white ${orbitron.className}`}
    >
      <div className="stars" />
      <div className="twinkling" />
      <div className="clouds" />
      <div className=" z-10 bg-[#10172a] p-8 py-10 rounded-3xl w-full max-w-md shadow-xl relative space-y-10">
        <h2 className="text-3xl font-bold my-4 bg-gr text-center tracking-wide">
          SPACE QUIZ
        </h2>

        <p className="text-center text-lg pt-2 font-medium">
          {current?.question}
        </p>

        <div className="space-y-2.5">
          {current?.options.map((opt, i) => {
            const isCorrect = opt === current?.answer;
            const isSelected = opt === selected;
            let bgColor = "bg-[#1E2A47] hover:bg-[#293b66]";

            if (selected) {
              if (isSelected && isCorrect) bgColor = "bg-green-600";
              else if (isSelected && !isCorrect) bgColor = "bg-red-600";
              else if (!isSelected && isCorrect) bgColor = "bg-gray-600";
              else bgColor = "bg-[#1E2A47]";
            }
            return (
              <button
                key={i}
                className={`w-sm pl-4 py-3 rounded-lg text-left transition
                ${bgColor}`}
                onClick={() => handleOptionClick(opt)}
                disabled={!!selected}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-3">
          <button
            className="w-3xs mt-3 text-center  bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition"
            onClick={handleNext}
          >
            Next
          </button>
        </div>

        <div className="absolute bottom-[-20px] left-[-40px] w-12">
          <RocketLottie />
        </div>
        <div className="absolute top-[-20px] right-[30px] w-12">
          <PlanetLottie />
        </div>
      </div>
    </div>
  );
}
