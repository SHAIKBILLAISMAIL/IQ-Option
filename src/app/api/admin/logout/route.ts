import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
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

    // Delete session from database
    const deletedSession = await db
      .delete(adminSessions)
      .where(eq(adminSessions.token, token))
      .returning();

    // Check if session was found and deleted
    if (deletedSession.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}