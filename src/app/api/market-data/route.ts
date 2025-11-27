import { NextRequest, NextResponse } from 'next/server';
import { getMarketData, getBatchMarketData } from '@/lib/market-data';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const symbols = request.nextUrl.searchParams.get('symbols');
  
  try {
    if (symbols) {
      // Batch request
      const symbolList = symbols.split(',').map(s => s.trim());
      const data = await getBatchMarketData(symbolList);
      
      return NextResponse.json({
        success: true,
        data,
        timestamp: Date.now(),
      });
    } else if (symbol) {
      // Single symbol request
      const data = await getMarketData(symbol);
      
      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Symbol not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data,
        timestamp: Date.now(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Symbol or symbols parameter required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Market data API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
