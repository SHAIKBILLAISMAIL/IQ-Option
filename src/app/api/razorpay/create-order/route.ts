import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getCurrentUser } from '@/lib/auth';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret',
});

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check for valid Razorpay keys
        const isMockMode = process.env.RAZORPAY_KEY_ID === 'rzp_test_sample_key';

        if (!process.env.RAZORPAY_KEY_ID || (process.env.RAZORPAY_KEY_ID === 'rzp_test_demo' && !isMockMode)) {
            console.error('Razorpay keys are missing or invalid');
            return NextResponse.json(
                { error: 'Missing Razorpay keys. Please add RAZORPAY_KEY_ID to .env.local' },
                { status: 500 }
            );
        }

        const { amount, currency = 'INR' } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // MOCK MODE: Return fake order if using sample keys
        if (isMockMode) {
            return NextResponse.json({
                orderId: `order_mock_${Date.now()}`,
                amount: Math.round(amount * 100),
                currency: currency.toUpperCase(),
                key: 'rzp_test_sample_key',
                isMock: true
            });
        }

        // Create Razorpay Order
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest currency unit)
            currency: currency.toUpperCase(),
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: user.id,
                userEmail: user.email,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo',
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create order' },
            { status: 500 }
        );
    }
}
