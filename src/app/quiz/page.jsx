'use client'

import { Orbitron } from 'next/font/google'
import PlanetLottie from '@/components/PlanetLottie'
import RocketLottie from '@/components/RocketLottie'
import { useEffect, useState } from 'react'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // adjust weights you want
})
export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showNext, setShowNext] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/quiz')
      const data = await res.json()
      setQuestions(data.quiz || [])
    }
    fetchData()
  }, [])

  const current = questions[currentIndex]

  const handleOptionClick = (option) => {
    setSelected(option)
    setShowNext(true)
    setTimeout(()=>{
         handleNext()
    },1000)
  }

  const handleNext = () => {
    setSelected(null)
    setShowNext(false)
    setCurrentIndex((prev) => prev + 1)
  }

  if (!current) {
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
        <p className="text-xl font-medium text-gray-300">Launching Space Quiz</p>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Establishing connection with NASA</span>
        </p>
      </div>
    </div>
  );
}

  return (
    <div
      className={`bottom-5 relative min-h-screen overflow-hidden flex items-center justify-center p-4 text-white ${orbitron.className}`}
    >
      <div className="stars" />
      <div className="twinkling" />
      <div className="clouds" />
      <div className=" z-10 bg-[#10172a] p-8 py-5 rounded-3xl h-1/2 w-full max-w-md shadow-xl relative space-y-6">
        <h2 className="text-3xl font-bold my-4 bg-gr text-center tracking-wide">
          SPACE QUIZ
        </h2>

        <p className="text-center text-lg pt-2 font-medium">{current.question}</p>

        <div className="space-y-2.5">
          {current.options.map((opt, i) => {
             const isCorrect = opt === current.answer
             const isSelected = opt === selected
             let bgColor = 'bg-[#1E2A47] hover:bg-[#293b66]'

             if(selected){
              if(isSelected && isCorrect) bgColor = 'bg-green-600'
              else if (isSelected && !isCorrect) bgColor = 'bg-red-600'
              else if (!isSelected && isCorrect) bgColor = 'bg-gray-600'
              else bgColor = 'bg-[#1E2A47]'
             }return(
            <button
              key={i}
              className={`w-sm pl-4 py-3 rounded-lg text-left transition
                ${bgColor}`}
              onClick={() => handleOptionClick(opt)}
              disabled={!!selected}
            >
              {opt}
            </button>
             )
          })}
        </div>

          <div className='flex justify-center mt-3'>
          <button
            className="w-3xs mt-3 text-center  bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition"
            onClick={handleNext}
          >
            Next
          </button>
          </div>

        <div className="absolute bottom-[-20px] left-[-40px] w-12">
          <RocketLottie/>
        </div>
        <div className="absolute top-[-20px] right-[30px] w-12">
          <PlanetLottie/>
        </div>
      </div>
    </div>
  )
}
