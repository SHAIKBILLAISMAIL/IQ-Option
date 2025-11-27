import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required', code: 'MISSING_PASSWORD' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, sanitizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists', code: 'USER_EXISTS' },
        { status: 409 }
      );
    }

    // Generate unique user ID
    const userId = randomUUID();
    const accountId = randomUUID();

    // Get current timestamp
    const now = new Date();

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db
      .insert(user)
      .values({
        id: userId,
        name: sanitizedName,
        email: sanitizedEmail,
        emailVerified: false,
        image: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Create account with credential provider - store hashed password
    await db
      .insert(account)
      .values({
        id: accountId,
        accountId: sanitizedEmail,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Return user data without password
    const userResponse = {
      id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      emailVerified: newUser[0].emailVerified,
      image: newUser[0].image,
      createdAt: newUser[0].createdAt,
      updatedAt: newUser[0].updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
        message: 'Demo user account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}