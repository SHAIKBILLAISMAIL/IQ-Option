import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminSessions } from '@/db/schema';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username) {
      return NextResponse.json(
        { 
          error: 'Username is required',
          code: 'MISSING_USERNAME'
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { 
          error: 'Password is required',
          code: 'MISSING_PASSWORD'
        },
        { status: 400 }
      );
    }

    // Validate credentials against fixed values
    if (username !== 'admin' || password !== 'admin123') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Extract IP address from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0].trim() || realIp || null;

    // Extract user agent from headers
    const userAgent = request.headers.get('user-agent') || null;

    // Create admin session
    const newSession = await db.insert(adminSessions)
      .values({
        adminUsername: username,
        token: token,
        expiresAt: expiresAt,
        createdAt: new Date(),
        ipAddress: ipAddress,
        userAgent: userAgent
      })
      .returning();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        token: token,
        expiresAt: expiresAt.toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}