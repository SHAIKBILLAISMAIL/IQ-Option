import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userBalances, withdrawals } from '@/db/schema';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHENTICATED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, user.id))
      .orderBy(desc(withdrawals.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Withdrawals GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHENTICATED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, method, payoutDetails } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (!method || typeof method !== 'string') {
      return NextResponse.json(
        { error: 'Withdrawal method is required', code: 'MISSING_METHOD' },
        { status: 400 }
      );
    }

    const balances = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, user.id))
      .limit(1);

    if (balances.length === 0) {
      return NextResponse.json(
        { error: 'Balance record not found', code: 'BALANCE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const balanceRecord = balances[0];

    // 1. Attempt atomic deduction first to ensure funds are locked
    const updatedBalances = await db
      .update(userBalances)
      .set({
        realBalance: sql`${userBalances.realBalance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(and(
        eq(userBalances.userId, user.id),
        gte(userBalances.realBalance, amount) // Condition: Balance must be >= amount
      ))
      .returning();

    // 2. If no rows updated, it means insufficient funds (race condition or just low balance)
    if (updatedBalances.length === 0) {
      return NextResponse.json(
        { error: 'Insufficient real balance', code: 'INSUFFICIENT_FUNDS' },
        { status: 400 }
      );
    }

    // 3. Create withdrawal record after successful deduction
    const now = new Date();
    const referenceId = `WD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const [newWithdrawal] = await db
      .insert(withdrawals)
      .values({
        userId: user.id,
        amount,
        currency: 'USD',
        method,
        payoutDetails: payoutDetails?.toString() ?? null,
        // For "real-time" experience, mark instant methods as completed immediately
        status: (method === 'upi' || method === 'instant_bank' || method === 'crypto') ? 'completed' : 'pending',
        referenceId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    console.error('Withdrawals POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

