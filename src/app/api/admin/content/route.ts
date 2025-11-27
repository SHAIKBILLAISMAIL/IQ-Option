import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageContent, adminSessions } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET - Fetch all homepage content sections (ADMIN ONLY)
export async function GET(request: NextRequest) {
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
      // Delete expired session
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
      return NextResponse.json(
        {
          error: 'Unauthorized - token expired',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    const results = await db
      .select()
      .from(homepageContent)
      .orderBy(asc(homepageContent.sectionKey));

    // Parse contentData from JSON string to object
    const parsedResults = results.map((section) => {
      try {
        return {
          ...section,
          contentData: JSON.parse(section.contentData),
        };
      } catch (parseError) {
        console.error(`Failed to parse contentData for section ${section.sectionKey}:`, parseError);
        return {
          ...section,
          contentData: {},
        };
      }
    });

    return NextResponse.json(parsedResults, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}

// POST - Create new content section (ADMIN ONLY)
export async function POST(request: NextRequest) {
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

    // Validate session using better-auth
    const session = await auth.api.getSession({
      headers: {
        authorization: authHeader,
      },
    });

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: 'Unauthorized - valid token required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        {
          error: 'Forbidden - admin access required',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { sectionKey, contentData } = body;

    // Validate required fields
    if (!sectionKey || typeof sectionKey !== 'string' || sectionKey.trim() === '') {
      return NextResponse.json(
        {
          error: 'sectionKey is required and must be a non-empty string',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    if (!contentData || typeof contentData !== 'object' || Array.isArray(contentData)) {
      return NextResponse.json(
        {
          error: 'contentData is required and must be a valid object',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    if (Object.keys(contentData).length === 0) {
      return NextResponse.json(
        {
          error: 'contentData cannot be empty',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Check if sectionKey already exists
    const existing = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.sectionKey, sectionKey.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error: 'A content section with this sectionKey already exists',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Convert contentData to JSON string
    let contentDataString: string;
    try {
      contentDataString = JSON.stringify(contentData);
    } catch (jsonError) {
      return NextResponse.json(
        {
          error: 'Failed to serialize contentData',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Create new content section
    const newSection = await db
      .insert(homepageContent)
      .values({
        sectionKey: sectionKey.trim(),
        contentData: contentDataString,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .returning();

    // Parse contentData back to object for response
    const responseSection = {
      ...newSection[0],
      contentData: JSON.parse(newSection[0].contentData),
    };

    return NextResponse.json(responseSection, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}