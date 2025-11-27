import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { trades, tradingHistory } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid trade ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const tradeId = parseInt(id);
    const body = await request.json();
    const { currentPrice, pnl, status, stopLoss, takeProfit } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['open', 'closed'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Status must be either "open" or "closed"',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate currentPrice if provided
    if (currentPrice !== undefined && currentPrice <= 0) {
      return NextResponse.json(
        {
          error: 'Current price must be positive',
          code: 'INVALID_CURRENT_PRICE',
        },
        { status: 400 }
      );
    }

    // Validate stopLoss if provided
    if (stopLoss !== undefined && stopLoss < 0) {
      return NextResponse.json(
        {
          error: 'Stop loss cannot be negative',
          code: 'INVALID_STOP_LOSS',
        },
        { status: 400 }
      );
    }

    // Validate takeProfit if provided
    if (takeProfit !== undefined && takeProfit < 0) {
      return NextResponse.json(
        {
          error: 'Take profit cannot be negative',
          code: 'INVALID_TAKE_PROFIT',
        },
        { status: 400 }
      );
    }

    // Find trade and verify ownership
    const existingTrade = await db
      .select()
      .from(trades)
      .where(eq(trades.id, tradeId))
      .limit(1);

    if (existingTrade.length === 0) {
      return NextResponse.json(
        { error: 'Trade not found', code: 'TRADE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify trade belongs to authenticated user
    if (existingTrade[0].userId !== user.id) {
      return NextResponse.json(
        {
          error: 'You do not have permission to update this trade',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (currentPrice !== undefined) updateData.currentPrice = currentPrice;
    if (pnl !== undefined) updateData.pnl = pnl;
    if (status !== undefined) updateData.status = status;
    if (stopLoss !== undefined) updateData.stopLoss = stopLoss;
    if (takeProfit !== undefined) updateData.takeProfit = takeProfit;

    // Update trade
    const updated = await db
      .update(trades)
      .set(updateData)
      .where(and(eq(trades.id, tradeId), eq(trades.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update trade', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid trade ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const tradeId = parseInt(id);
    
    // Try to parse request body, but provide default if empty
    let body;
    try {
      const text = await request.text();
      body = text && text.trim() !== '' ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      body = {};
    }
    
    const { exitPrice, pnl } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (exitPrice === undefined || exitPrice === null) {
      return NextResponse.json(
        { error: 'Exit price is required in request body', code: 'MISSING_EXIT_PRICE' },
        { status: 400 }
      );
    }

    if (pnl === undefined || pnl === null) {
      return NextResponse.json(
        { error: 'PnL is required in request body', code: 'MISSING_PNL' },
        { status: 400 }
      );
    }

    // Validate exitPrice is positive
    if (exitPrice <= 0) {
      return NextResponse.json(
        { error: 'Exit price must be positive', code: 'INVALID_EXIT_PRICE' },
        { status: 400 }
      );
    }

    // Validate pnl is a number
    if (typeof pnl !== 'number' || isNaN(pnl)) {
      return NextResponse.json(
        { error: 'PnL must be a valid number', code: 'INVALID_PNL' },
        { status: 400 }
      );
    }

    // Find trade and verify ownership
    const existingTrade = await db
      .select()
      .from(trades)
      .where(eq(trades.id, tradeId))
      .limit(1);

    if (existingTrade.length === 0) {
      return NextResponse.json(
        { error: 'Trade not found', code: 'TRADE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify trade belongs to authenticated user
    if (existingTrade[0].userId !== user.id) {
      return NextResponse.json(
        {
          error: 'You do not have permission to close this trade',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    const trade = existingTrade[0];

    // Create entry in trading_history
    const historyEntry = await db
      .insert(tradingHistory)
      .values({
        userId: user.id,
        tradeId: trade.id,
        assetName: trade.assetName,
        assetType: trade.assetType,
        direction: trade.direction,
        amount: trade.amount,
        entryPrice: trade.entryPrice,
        exitPrice: exitPrice,
        quantity: trade.quantity,
        leverage: trade.leverage,
        pnl: pnl,
        accountType: trade.accountType,
        openedAt: trade.openedAt,
        closedAt: new Date(),
      })
      .returning();

    if (historyEntry.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to create history entry',
          code: 'HISTORY_CREATE_FAILED',
        },
        { status: 500 }
      );
    }

    // Delete trade from trades table
    const deleted = await db
      .delete(trades)
      .where(and(eq(trades.id, tradeId), eq(trades.userId, user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete trade', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Trade closed successfully',
        historyEntry: historyEntry[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}