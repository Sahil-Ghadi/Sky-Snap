import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || undefined;

    const response = await fetch(
      `https://lldev.thespacedevs.com/2.2.0/launch/?limit=50&search=${searchQuery || ''}`
    );

    if (!response.ok) throw new Error('Failed to fetch missions');
    
    const data = await response.json();
    return NextResponse.json(data.results);
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}