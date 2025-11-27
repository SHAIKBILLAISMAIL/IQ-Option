import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section_key: string }> }
) {
  try {
    // Check if database is configured
    if (!process.env.TURSO_CONNECTION_URL && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          code: 'DATABASE_NOT_CONFIGURED'
        },
        { status: 503 }
      );
    }

    const { section_key } = await params;

    if (!section_key || section_key.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Section key is required',
          code: 'MISSING_SECTION_KEY'
        },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.sectionKey, section_key))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { 
          error: 'Content section not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const content = result[0];
    
    let parsedContentData;
    try {
      parsedContentData = JSON.parse(content.contentData);
    } catch (parseError) {
      console.error('JSON parse error for contentData:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid content data format',
          code: 'INVALID_CONTENT_FORMAT'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sectionKey: content.sectionKey,
      contentData: parsedContentData,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}