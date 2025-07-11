'use client'

import Lottie from 'lottie-react'
import rocketAnim from '@/lotties/Startup.json' // adjust if different path

export default function RocketLottie() {
  return (
    <div className="w-30 h-30 mx-auto">
      <Lottie animationData={rocketAnim} loop={true} />
    </div>
  )
}
