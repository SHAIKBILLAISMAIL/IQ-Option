import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageContent, adminSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section_key: string }> }
) {
  try {
    // Extract and validate bearer token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Unauthorized - valid token required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Validate admin session
    const session = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json(
        {
          error: 'Unauthorized - invalid token',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Check if token is expired - Turso stores timestamps as Unix seconds
    const expiresAtSeconds = typeof session[0].expiresAt === 'number' 
      ? session[0].expiresAt
      : Math.floor(new Date(session[0].expiresAt).getTime() / 1000);
    
    const nowSeconds = Math.floor(Date.now() / 1000);
    
    if (expiresAtSeconds < nowSeconds) {
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
      return NextResponse.json(
        {
          error: 'Unauthorized - token expired',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
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
      id: content.id,
      sectionKey: content.sectionKey,
      contentData: parsedContentData,
      updatedAt: content.updatedAt,
      updatedBy: content.updatedBy
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section_key: string }> }
) {
  try {
    // Extract and validate bearer token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Unauthorized - valid token required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Validate admin session
    const session = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json(
        {
          error: 'Unauthorized - invalid token',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Check if token is expired - Turso stores timestamps as Unix seconds
    const expiresAtSeconds = typeof session[0].expiresAt === 'number' 
      ? session[0].expiresAt
      : Math.floor(new Date(session[0].expiresAt).getTime() / 1000);
    
    const nowSeconds = Math.floor(Date.now() / 1000);
    
    if (expiresAtSeconds < nowSeconds) {
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
      return NextResponse.json(
        {
          error: 'Unauthorized - token expired',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
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

    // Parse request body
    const body = await request.json();
    const { contentData } = body;

    if (!contentData || typeof contentData !== 'object') {
      return NextResponse.json(
        { 
          error: 'Content data is required and must be an object',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingContent = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.sectionKey, section_key))
      .limit(1);

    // Convert contentData to JSON string
    let contentDataString;
    try {
      contentDataString = JSON.stringify(contentData);
    } catch (stringifyError) {
      console.error('JSON stringify error:', stringifyError);
      return NextResponse.json(
        { 
          error: 'Invalid content data format',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    let updatedContent;

    if (existingContent.length === 0) {
      // Create new section if it doesn't exist
      const newContent = await db
        .insert(homepageContent)
        .values({
          sectionKey: section_key,
          contentData: contentDataString,
          updatedAt: new Date(),
          updatedBy: session[0].adminUsername,
        })
        .returning();

      updatedContent = newContent[0];
    } else {
      // Update existing section
      const updated = await db
        .update(homepageContent)
        .set({
          contentData: contentDataString,
          updatedAt: new Date(),
          updatedBy: session[0].adminUsername,
        })
        .where(eq(homepageContent.sectionKey, section_key))
        .returning();

      updatedContent = updated[0];
    }

    // Parse contentData for response
    let parsedContentData;
    try {
      parsedContentData = JSON.parse(updatedContent.contentData);
    } catch (parseError) {
      console.error('JSON parse error for updated contentData:', parseError);
      parsedContentData = contentData;
    }

    return NextResponse.json({
      id: updatedContent.id,
      sectionKey: updatedContent.sectionKey,
      contentData: parsedContentData,
      updatedAt: updatedContent.updatedAt,
      updatedBy: updatedContent.updatedBy
    });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}