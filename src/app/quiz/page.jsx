'use client'

import { delay } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Quiz() {
  const [quiz, setQuiz] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0) 
  const [selected, setSelected] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch('/api/quiz')
      const data = await res.json()
      console.log(data.quiz);
      setQuiz(data.quiz)
     }
    fetchQuiz()
  }, [])

  const current = quiz[currentIndex]
  console.log(current);
  const handleOptionClick = (option) => {
    setSelected(option)
    setShowAnswer(true)
  }
  return (
     <div className="max-w-xl mx-auto p-6 text-white">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Question {currentIndex + 1}
      </h2>

      <p className="mb-6 text-lg">{current.question}</p>

      <ul className="space-y-4">
        {current.options.map((opt, i) => {
          const isCorrect = opt === current.answer
          const isSelected = opt === selected

          return (
            <li
              key={i}
              className={`p-3 border rounded-lg cursor-pointer transition
                ${showAnswer && isCorrect ? 'bg-green-500/70' : ''}
                ${showAnswer && isSelected && !isCorrect ? 'bg-red-500/70' : ''}
                ${!showAnswer ? 'hover:bg-white/10' : ''}
              `}
              onClick={() => !showAnswer && handleOptionClick(opt)}
            >
              {opt}
            </li>
          )
        })}
      </ul>
{/* 
      {showAnswer && currentIndex < quiz.length - 1 && (
        <button
          onClick={handleNext}
          className="mt-6 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition"
        >
          Next Question →
        </button>
      )} */}

      {showAnswer && currentIndex === quiz.length - 1 && (
        <p className="mt-6 font-semibold text-green-400">
          🎉 You’ve completed the quiz!
        </p>
      )}
    </div>
  )
}
