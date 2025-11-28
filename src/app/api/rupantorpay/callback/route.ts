import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { deposits, userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status'); // success, failed, etc.
        const transactionId = searchParams.get('trx_id') || searchParams.get('transaction_id');
        const amount = searchParams.get('amount');

        // Note: In a real production environment, you should verify the payment signature 
        // or call a verification endpoint to ensure the callback is legitimate.

        if (status !== 'success' && status !== 'Completed') {
            return NextResponse.redirect(new URL('/trade?payment=failed', request.url));
        }

        if (!transactionId) {
            return NextResponse.redirect(new URL('/trade?payment=error', request.url));
        }

        // Find the deposit (You might need to store the transactionId beforehand or create it here)
        // If we created the deposit record BEFORE redirecting (in create-charge), we update it.
        // If not, we might need to create it here (but better to create it pending first).

        // Let's assume we create a pending deposit in the UI/API before calling create-charge, 
        // or we use the transactionId to find it.

        // For now, let's try to find a pending deposit with this transactionId
        const depositRecord = await db.select()
            .from(deposits)
            .where(eq(deposits.transactionId, transactionId))
            .limit(1);

        if (depositRecord.length === 0) {
            // Record not found. 
            console.error('Deposit record not found for:', transactionId);
            return NextResponse.redirect(new URL('/trade?payment=not_found', request.url));
        }

        const deposit = depositRecord[0];

        if (deposit.status === 'completed') {
            return NextResponse.redirect(new URL('/trade?payment=already_processed', request.url));
        }

        // Update deposit status
        await db.update(deposits)
            .set({ status: 'completed' })
            .where(eq(deposits.id, deposit.id));

        // Update user balance
        const userBalance = await db.select()
            .from(userBalances)
            .where(eq(userBalances.userId, deposit.userId))
            .limit(1);

        if (userBalance.length > 0) {
            await db.update(userBalances)
                .set({
                    realBalance: userBalance[0].realBalance + deposit.amount,
                    updatedAt: new Date(),
                })
                .where(eq(userBalances.userId, deposit.userId));
        } else {
            // Create balance record if not exists
            await db.insert(userBalances).values({
                userId: deposit.userId,
                realBalance: deposit.amount,
                balance: 10000, // Default practice balance
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        return NextResponse.redirect(new URL(`/trade?payment=success&amount=${deposit.amount}`, request.url));

    } catch (error) {
        console.error('RupantorPay callback error:', error);
        return NextResponse.redirect(new URL('/trade?payment=error', request.url));
    }
}

// Also handle POST if they send a webhook
export async function POST(request: NextRequest) {
    // Similar logic for webhook
    return NextResponse.json({ received: true });
}
