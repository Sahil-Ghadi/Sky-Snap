import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEWS_APIKEY;
    const url = `https://newsapi.org/v2/everything?q=space+astronomy&sortBy=publishedAt&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data.articles.slice(0, 9)); 
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}