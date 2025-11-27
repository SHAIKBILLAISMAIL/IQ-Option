import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { deposits, userBalances } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { sql, eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            paymentMethod,
        } = await request.json();

        // Check if this is a mock payment
        const isMockPayment = razorpay_order_id?.startsWith('order_mock_');

        // Verify signature (skip for mock payments)
        if (!isMockPayment) {
            const secret = process.env.RAZORPAY_KEY_SECRET || 'demo_secret';
            const generatedSignature = crypto
                .createHmac('sha256', secret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

            if (generatedSignature !== razorpay_signature) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        }

        // Calculate amounts
        // Razorpay amount is in paise (e.g., 830000 for ₹8300)
        const amountInRupees = amount / 100;
        // System balance is in USD. Assuming 1 USD = 83 INR
        const amountInUSD = amountInRupees / 83;

        // Create deposit record
        const deposit = await db.insert(deposits).values({
            userId: user.id,
            amount: amountInUSD, // Store in USD to match system currency
            currency: 'USD',
            paymentMethod: paymentMethod || 'razorpay',
            status: 'completed',
            transactionId: razorpay_payment_id,
            createdAt: new Date(),
        }).returning();

        // Update user balance atomically
        await db.update(userBalances)
            .set({
                realBalance: sql`${userBalances.realBalance} + ${amountInUSD}`,
                updatedAt: new Date(),
            })
            .where(eq(userBalances.userId, user.id));

        return NextResponse.json({
            success: true,
            deposit: deposit[0],
            message: 'Payment verified successfully',
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Verification failed' },
            { status: 500 }
        );
    }
}
