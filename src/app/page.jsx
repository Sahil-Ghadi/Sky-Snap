'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function GetStarted() {
  return (
    <section
      className={cn(
        orbitron.className,
        'w-full h-screen bg-cover bg-center relative flex items-center justify-center text-white'
      )}
      style={{
        backgroundImage:
          "url('1280x800-colorful-galaxy-4k_1546279102.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center px-4"
      >
        <h1 className="text-sm md:text-lg font-semibold text-blue-200 tracking-widest uppercase mb-2">
          Welcome to
        </h1>

        <motion.h2
          initial={{ fontWeight: 300 }}
          whileHover={{ fontWeight: 700 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold m-4"
        >
          SykSnap
        </motion.h2>

        <p className="text-lg md:text-xl text-blue-200 mt-7 max-w-xl mx-auto">
          Discover the cosmos, explore planets, track space launches, and challenge your knowledge with quizzes.
        </p>

        <Button asChild className="mt-6 text-base font-bold px-6 py-6 rounded-xl">
          <Link href="/home">Get Started 🚀</Link>
        </Button>
      </motion.div>
    </section>
  )
}
