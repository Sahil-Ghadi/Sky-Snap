'use client'

import Lottie from 'lottie-react'
import planetAnim from '@/lotties/Planet.json' // adjust if different path

export default function PlanetLottie() {
  return (
    <div className="w-35 h-30 mx-auto">
      <Lottie animationData={planetAnim} loop={true} />
    </div>
  )
}
