import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Parse Bearer token
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Query adminSessions table for matching token
    const sessions = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1);

    // Check if session exists
    if (sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const session = sessions[0];

    // Check if session is expired
    const currentTime = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (expiresAt < currentTime) {
      // Delete expired session
      await db
        .delete(adminSessions)
        .where(eq(adminSessions.token, token));

      return NextResponse.json(
        { success: false, error: 'Token expired' },
        { status: 401 }
      );
    }

    // Return valid session
    return NextResponse.json(
      {
        success: true,
        session: {
          id: session.id,
          adminUsername: session.adminUsername,
          expiresAt: session.expiresAt,
          createdAt: session.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}