import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const balance = await db.select()
      .from(userBalances)
      .where(eq(userBalances.userId, user.id))
      .limit(1);

    if (balance.length === 0) {
      return NextResponse.json({ 
        error: 'Balance not found',
        code: 'BALANCE_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(balance[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const requestBody = await request.json();
    
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const existingBalance = await db.select()
      .from(userBalances)
      .where(eq(userBalances.userId, user.id))
      .limit(1);

    if (existingBalance.length > 0) {
      return NextResponse.json({ 
        error: 'Balance already exists',
        code: 'BALANCE_EXISTS' 
      }, { status: 400 });
    }

    const now = new Date();
    const newBalance = await db.insert(userBalances)
      .values({
        userId: user.id,
        balance: 10000.00,
        realBalance: 0.00,
        currency: 'USD',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newBalance[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const requestBody = await request.json();
    
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { balance, realBalance, currency } = requestBody;

    if (balance !== undefined && typeof balance !== 'number') {
      return NextResponse.json({ 
        error: 'Balance must be a number',
        code: 'INVALID_BALANCE_TYPE' 
      }, { status: 400 });
    }

    if (realBalance !== undefined && typeof realBalance !== 'number') {
      return NextResponse.json({ 
        error: 'Real balance must be a number',
        code: 'INVALID_REAL_BALANCE_TYPE' 
      }, { status: 400 });
    }

    if (currency !== undefined && typeof currency !== 'string') {
      return NextResponse.json({ 
        error: 'Currency must be a string',
        code: 'INVALID_CURRENCY_TYPE' 
      }, { status: 400 });
    }

    const existingBalance = await db.select()
      .from(userBalances)
      .where(eq(userBalances.userId, user.id))
      .limit(1);

    if (existingBalance.length === 0) {
      return NextResponse.json({ 
        error: 'Balance not found',
        code: 'BALANCE_NOT_FOUND' 
      }, { status: 404 });
    }

    const updates: any = {
      updatedAt: new Date()
    };

    if (balance !== undefined) {
      updates.balance = balance;
    }

    if (realBalance !== undefined) {
      updates.realBalance = realBalance;
    }

    if (currency !== undefined) {
      updates.currency = currency.trim();
    }

    const updated = await db.update(userBalances)
      .set(updates)
      .where(eq(userBalances.userId, user.id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}