import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

const INITIAL_CONTENT = {
  hero: {
    headline: "12 years of launching trading careers",
    subheadline: "Join IQ Option — the first-choice broker for 170 172 081 traders across 160 countries",
    traderCount: "170172081",
    countryCount: "160"
  },
  awards: {
    awards: [
      {
        title: "Best Trading Platform",
        organization: "World Finance Awards",
        year: "2023",
        iconUrl: "/awards/world-finance.svg"
      },
      {
        title: "Most Innovative Broker",
        organization: "Global Banking & Finance Review",
        year: "2023",
        iconUrl: "/awards/gbfr.svg"
      },
      {
        title: "Best Mobile Trading App",
        organization: "International Business Magazine",
        year: "2022",
        iconUrl: "/awards/ibm.svg"
      },
      {
        title: "Excellence in Trading Technology",
        organization: "Finance Magnates",
        year: "2022",
        iconUrl: "/awards/finance-magnates.svg"
      }
    ]
  },
  ticker: {
    items: [
      { name: "EUR/USD", change: "+0.45%" },
      { name: "GBP/USD", change: "-0.23%" },
      { name: "USD/JPY", change: "+0.67%" },
      { name: "BTC/USD", change: "+2.34%" },
      { name: "ETH/USD", change: "+1.89%" },
      { name: "AAPL", change: "+0.92%" },
      { name: "TSLA", change: "-1.15%" },
      { name: "GOLD", change: "+0.31%" }
    ]
  },
  demo_account: {
    headline: "Practice with a free demo account",
    features: [
      "Risk-free trading with virtual funds",
      "Access to all trading instruments",
      "Real-time market data",
      "Learn trading strategies"
    ]
  },
  deposits: {
    headline: "Start trading with as little as $10",
    country: "United States"
  }
};

export async function POST(request: NextRequest) {
  try {
    const sectionsToCreate = [];
    const existingSections = [];
    const sectionKeys = Object.keys(INITIAL_CONTENT);

    // Check which sections already exist
    for (const sectionKey of sectionKeys) {
      const existing = await db.select()
        .from(homepageContent)
        .where(eq(homepageContent.sectionKey, sectionKey))
        .limit(1);

      if (existing.length === 0) {
        sectionsToCreate.push({
          sectionKey,
          contentData: JSON.stringify(INITIAL_CONTENT[sectionKey as keyof typeof INITIAL_CONTENT]),
          updatedAt: new Date(),
          updatedBy: null
        });
      } else {
        existingSections.push(sectionKey);
      }
    }

    // Insert only new sections if any
    if (sectionsToCreate.length > 0) {
      await db.insert(homepageContent).values(sectionsToCreate);
    }

    const responseMessage = sectionsToCreate.length === 0
      ? "All sections already exist"
      : sectionsToCreate.length === sectionKeys.length
      ? "Initial content seeded successfully"
      : `Seeded ${sectionsToCreate.length} new sections, ${existingSections.length} already existed`;

    return NextResponse.json({
      success: true,
      message: responseMessage,
      sectionsCreated: sectionsToCreate.length,
      existingSections: existingSections,
      createdSections: sectionsToCreate.map(s => s.sectionKey)
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}