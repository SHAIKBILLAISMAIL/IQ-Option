import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { deposits } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

const VALID_STATUSES = ['pending', 'completed', 'failed'] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Validate deposit ID
    const depositId = params.id;
    if (!depositId || isNaN(parseInt(depositId))) {
      return NextResponse.json(
        { error: 'Valid deposit ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status field
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Find deposit by ID
    const existingDeposit = await db
      .select()
      .from(deposits)
      .where(eq(deposits.id, parseInt(depositId)))
      .limit(1);

    if (existingDeposit.length === 0) {
      return NextResponse.json(
        { error: 'Deposit not found', code: 'DEPOSIT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify deposit ownership
    if (existingDeposit[0].userId !== user.id) {
      return NextResponse.json(
        {
          error: 'You do not have permission to update this deposit',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Update deposit status
    const updated = await db
      .update(deposits)
      .set({
        status,
      })
      .where(and(eq(deposits.id, parseInt(depositId)), eq(deposits.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update deposit', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT deposit error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}