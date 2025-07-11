import { NextResponse } from 'next/server'
import { quizData } from '@/lib/quizdata'

export async function GET() {
  try {
    return NextResponse.json(quizData)
  } catch (err) {
    console.error('Error in /api/quiz:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

