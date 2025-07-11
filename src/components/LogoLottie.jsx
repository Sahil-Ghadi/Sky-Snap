'use client'

import Lottie from 'lottie-react'
import logoAnim from '@/lotties/Logo.json' // adjust if different path

export default function LogoLottie() {
  return (
    <div className="w-60 h-45 mx-auto">
      <Lottie animationData={logoAnim} loop={true} />
    </div>
  )
}
