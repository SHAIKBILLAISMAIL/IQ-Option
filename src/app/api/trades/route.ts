import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { trades } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({
        error: 'Authentication required',
        code: 'UNAUTHENTICATED'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const accountType = searchParams.get('account_type');
    const assetType = searchParams.get('asset_type');

    let query = db.select()
      .from(trades)
      .where(and(
        eq(trades.userId, user.id),
        eq(trades.status, 'open')
      ))
      .orderBy(desc(trades.openedAt))
      .limit(limit)
      .offset(offset);

    const conditions = [
      eq(trades.userId, user.id),
      eq(trades.status, 'open')
    ];

    if (accountType) {
      if (accountType !== 'practice' && accountType !== 'real') {
        return NextResponse.json({
          error: 'Invalid account_type. Must be "practice" or "real"',
          code: 'INVALID_ACCOUNT_TYPE'
        }, { status: 400 });
      }
      conditions.push(eq(trades.accountType, accountType));
    }

    if (assetType) {
      const validAssetTypes = ['crypto', 'forex', 'stocks', 'indices', 'commodities'];
      if (!validAssetTypes.includes(assetType)) {
        return NextResponse.json({
          error: 'Invalid asset_type. Must be one of: crypto, forex, stocks, indices, commodities',
          code: 'INVALID_ASSET_TYPE'
        }, { status: 400 });
      }
      conditions.push(eq(trades.assetType, assetType));
    }

    const results = await db.select()
      .from(trades)
      .where(and(...conditions))
      .orderBy(desc(trades.openedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({
        error: 'Authentication required',
        code: 'UNAUTHENTICATED'
      }, { status: 401 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED"
      }, { status: 400 });
    }

    const {
      assetName,
      assetType,
      direction,
      amount,
      entryPrice,
      currentPrice,
      quantity,
      leverage,
      stopLoss,
      takeProfit,
      accountType
    } = body;

    if (!assetName) {
      return NextResponse.json({
        error: "assetName is required",
        code: "MISSING_ASSET_NAME"
      }, { status: 400 });
    }

    if (!assetType) {
      return NextResponse.json({
        error: "assetType is required",
        code: "MISSING_ASSET_TYPE"
      }, { status: 400 });
    }

    const validAssetTypes = ['crypto', 'forex', 'stocks', 'indices', 'commodities'];
    if (!validAssetTypes.includes(assetType)) {
      return NextResponse.json({
        error: 'Invalid assetType. Must be one of: crypto, forex, stocks, indices, commodities',
        code: 'INVALID_ASSET_TYPE'
      }, { status: 400 });
    }

    if (!direction) {
      return NextResponse.json({
        error: "direction is required",
        code: "MISSING_DIRECTION"
      }, { status: 400 });
    }

    if (direction !== 'buy' && direction !== 'sell') {
      return NextResponse.json({
        error: 'Invalid direction. Must be "buy" or "sell"',
        code: 'INVALID_DIRECTION'
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({
        error: "amount is required",
        code: "MISSING_AMOUNT"
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({
        error: "amount must be a positive number",
        code: "INVALID_AMOUNT"
      }, { status: 400 });
    }

    if (entryPrice === undefined || entryPrice === null) {
      return NextResponse.json({
        error: "entryPrice is required",
        code: "MISSING_ENTRY_PRICE"
      }, { status: 400 });
    }

    if (typeof entryPrice !== 'number' || entryPrice <= 0) {
      return NextResponse.json({
        error: "entryPrice must be a positive number",
        code: "INVALID_ENTRY_PRICE"
      }, { status: 400 });
    }

    if (currentPrice === undefined || currentPrice === null) {
      return NextResponse.json({
        error: "currentPrice is required",
        code: "MISSING_CURRENT_PRICE"
      }, { status: 400 });
    }

    if (typeof currentPrice !== 'number' || currentPrice <= 0) {
      return NextResponse.json({
        error: "currentPrice must be a positive number",
        code: "INVALID_CURRENT_PRICE"
      }, { status: 400 });
    }

    if (quantity === undefined || quantity === null) {
      return NextResponse.json({
        error: "quantity is required",
        code: "MISSING_QUANTITY"
      }, { status: 400 });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({
        error: "quantity must be a positive number",
        code: "INVALID_QUANTITY"
      }, { status: 400 });
    }

    const validAccountTypes = ['practice', 'real'];
    const finalAccountType = accountType || 'practice';
    if (!validAccountTypes.includes(finalAccountType)) {
      return NextResponse.json({
        error: 'Invalid accountType. Must be "practice" or "real"',
        code: 'INVALID_ACCOUNT_TYPE'
      }, { status: 400 });
    }

    const now = new Date();
    let expiresAt = null;
    if (body.duration) {
      expiresAt = new Date(now.getTime() + body.duration * 60000);
    }

    const newTrade = await db.insert(trades)
      .values({
        userId: user.id,
        assetName: assetName.trim(),
        assetType,
        direction,
        amount,
        entryPrice,
        currentPrice,
        quantity,
        leverage: leverage || 1,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
        pnl: 0.00,
        status: 'open',
        accountType: finalAccountType,
        duration: body.duration || null,
        expiresAt: expiresAt,
        openedAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newTrade[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}