import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tradingHistory } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const accountType = searchParams.get('account_type');
    const assetType = searchParams.get('asset_type');

    let query = db
      .select()
      .from(tradingHistory)
      .where(eq(tradingHistory.userId, user.id))
      .orderBy(desc(tradingHistory.closedAt));

    const conditions = [eq(tradingHistory.userId, user.id)];

    if (accountType) {
      if (accountType !== 'practice' && accountType !== 'real') {
        return NextResponse.json(
          { error: 'Invalid account_type. Must be practice or real', code: 'INVALID_ACCOUNT_TYPE' },
          { status: 400 }
        );
      }
      conditions.push(eq(tradingHistory.accountType, accountType));
    }

    if (assetType) {
      const validAssetTypes = ['crypto', 'forex', 'stocks', 'indices', 'commodities'];
      if (!validAssetTypes.includes(assetType)) {
        return NextResponse.json(
          { 
            error: `Invalid asset_type. Must be one of: ${validAssetTypes.join(', ')}`, 
            code: 'INVALID_ASSET_TYPE' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(tradingHistory.assetType, assetType));
    }

    if (conditions.length > 1) {
      query = db
        .select()
        .from(tradingHistory)
        .where(and(...conditions))
        .orderBy(desc(tradingHistory.closedAt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
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
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        { error: 'User ID cannot be provided in request body', code: 'USER_ID_NOT_ALLOWED' },
        { status: 400 }
      );
    }

    const {
      tradeId,
      assetName,
      assetType,
      direction,
      amount,
      entryPrice,
      exitPrice,
      quantity,
      leverage,
      pnl,
      accountType,
      openedAt,
      closedAt,
    } = body;

    if (!assetName) {
      return NextResponse.json(
        { error: 'assetName is required', code: 'MISSING_ASSET_NAME' },
        { status: 400 }
      );
    }

    if (!assetType) {
      return NextResponse.json(
        { error: 'assetType is required', code: 'MISSING_ASSET_TYPE' },
        { status: 400 }
      );
    }

    const validAssetTypes = ['crypto', 'forex', 'stocks', 'indices', 'commodities'];
    if (!validAssetTypes.includes(assetType)) {
      return NextResponse.json(
        { 
          error: `Invalid assetType. Must be one of: ${validAssetTypes.join(', ')}`, 
          code: 'INVALID_ASSET_TYPE' 
        },
        { status: 400 }
      );
    }

    if (!direction) {
      return NextResponse.json(
        { error: 'direction is required', code: 'MISSING_DIRECTION' },
        { status: 400 }
      );
    }

    if (direction !== 'buy' && direction !== 'sell') {
      return NextResponse.json(
        { error: 'Invalid direction. Must be buy or sell', code: 'INVALID_DIRECTION' },
        { status: 400 }
      );
    }

    if (!accountType) {
      return NextResponse.json(
        { error: 'accountType is required', code: 'MISSING_ACCOUNT_TYPE' },
        { status: 400 }
      );
    }

    if (accountType !== 'practice' && accountType !== 'real') {
      return NextResponse.json(
        { error: 'Invalid accountType. Must be practice or real', code: 'INVALID_ACCOUNT_TYPE' },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'amount is required', code: 'MISSING_AMOUNT' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (entryPrice === undefined || entryPrice === null) {
      return NextResponse.json(
        { error: 'entryPrice is required', code: 'MISSING_ENTRY_PRICE' },
        { status: 400 }
      );
    }

    if (typeof entryPrice !== 'number' || entryPrice <= 0) {
      return NextResponse.json(
        { error: 'entryPrice must be a positive number', code: 'INVALID_ENTRY_PRICE' },
        { status: 400 }
      );
    }

    if (exitPrice === undefined || exitPrice === null) {
      return NextResponse.json(
        { error: 'exitPrice is required', code: 'MISSING_EXIT_PRICE' },
        { status: 400 }
      );
    }

    if (typeof exitPrice !== 'number' || exitPrice <= 0) {
      return NextResponse.json(
        { error: 'exitPrice must be a positive number', code: 'INVALID_EXIT_PRICE' },
        { status: 400 }
      );
    }

    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: 'quantity is required', code: 'MISSING_QUANTITY' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be a positive number', code: 'INVALID_QUANTITY' },
        { status: 400 }
      );
    }

    if (leverage === undefined || leverage === null) {
      return NextResponse.json(
        { error: 'leverage is required', code: 'MISSING_LEVERAGE' },
        { status: 400 }
      );
    }

    if (typeof leverage !== 'number' || leverage <= 0 || !Number.isInteger(leverage)) {
      return NextResponse.json(
        { error: 'leverage must be a positive integer', code: 'INVALID_LEVERAGE' },
        { status: 400 }
      );
    }

    if (pnl === undefined || pnl === null) {
      return NextResponse.json(
        { error: 'pnl is required', code: 'MISSING_PNL' },
        { status: 400 }
      );
    }

    if (typeof pnl !== 'number') {
      return NextResponse.json(
        { error: 'pnl must be a number', code: 'INVALID_PNL' },
        { status: 400 }
      );
    }

    const now = new Date();
    const openedAtTimestamp = openedAt ? new Date(openedAt) : now;
    const closedAtTimestamp = closedAt ? new Date(closedAt) : now;

    const newHistory = await db
      .insert(tradingHistory)
      .values({
        userId: user.id,
        tradeId: tradeId ?? null,
        assetName: assetName.trim(),
        assetType,
        direction,
        amount,
        entryPrice,
        exitPrice,
        quantity,
        leverage,
        pnl,
        accountType,
        openedAt: openedAtTimestamp,
        closedAt: closedAtTimestamp,
      })
      .returning();

    return NextResponse.json(newHistory[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}