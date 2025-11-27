import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { account } from '@/db/schema';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Test123!', saltRounds);

    // Get current timestamp in Unix epoch seconds
    const currentTimestamp = new Date();

    // Prepare account data
    const accountData = {
      id: crypto.randomUUID(),
      accountId: 'test@iqoption.com',
      providerId: 'credential',
      userId: 'test_user_5DA197C88A273B1397F8D391DA9E963E',
      password: hashedPassword,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
    };

    // Insert the account record
    const newAccount = await db.insert(account)
      .values(accountData)
      .returning();

    if (newAccount.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create account', code: 'CREATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(newAccount[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}