import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { deposits } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const statusFilter = searchParams.get('status');

    // Build where conditions upfront (cannot chain .where() calls in Drizzle)
    const whereConditions = statusFilter
      ? and(eq(deposits.userId, user.id), eq(deposits.status, statusFilter))
      : eq(deposits.userId, user.id);

    const results = await db
      .select()
      .from(deposits)
      .where(whereConditions)
      .orderBy(desc(deposits.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const { amount, currency, paymentMethod, transactionId } = body;

    if (!amount) {
      return NextResponse.json(
        {
          error: 'Amount is required',
          code: 'MISSING_AMOUNT',
        },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        {
          error: 'Payment method is required',
          code: 'MISSING_PAYMENT_METHOD',
        },
        { status: 400 }
      );
    }

    if (!transactionId) {
      return NextResponse.json(
        {
          error: 'Transaction ID is required',
          code: 'MISSING_TRANSACTION_ID',
        },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        {
          error: 'Amount must be a positive number',
          code: 'INVALID_AMOUNT',
        },
        { status: 400 }
      );
    }

    const validPaymentMethods = ['card', 'crypto', 'bank_transfer', 'rupantorpay'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          error: 'Invalid payment method. Must be one of: card, crypto, bank_transfer, rupantorpay',
          code: 'INVALID_PAYMENT_METHOD',
        },
        { status: 400 }
      );
    }

    const existingTransaction = await db
      .select()
      .from(deposits)
      .where(eq(deposits.transactionId, transactionId))
      .limit(1);

    if (existingTransaction.length > 0) {
      return NextResponse.json(
        {
          error: 'Transaction ID already exists',
          code: 'DUPLICATE_TRANSACTION_ID',
        },
        { status: 400 }
      );
    }

    const newDeposit = await db
      .insert(deposits)
      .values({
        userId: user.id,
        amount: parsedAmount,
        currency: currency || 'USD',
        paymentMethod: paymentMethod,
        status: 'pending',
        transactionId: transactionId,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newDeposit[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}