import { NextRequest, NextResponse } from 'next/server';

const RUPANTORPAY_API_KEY = process.env.RUPANTORPAY_API_KEY;
const RUPANTORPAY_BASE_URL = process.env.RUPANTORPAY_BASE_URL || 'https://rupantorpay.com/api'; // Placeholder URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, currency = 'BDT', customerName, customerEmail } = body;

        if (!RUPANTORPAY_API_KEY) {
            return NextResponse.json(
                { error: 'RupantorPay API key is not configured' },
                { status: 500 }
            );
        }

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Valid amount is required' },
                { status: 400 }
            );
        }

        // Construct the payload
        // Note: This is a generic payload structure. You may need to adjust fields based on RupantorPay's actual API docs.
        // Create Form Data (x-www-form-urlencoded)
        // Many PHP-based gateways expect Form Data, not JSON.
        const formData = new URLSearchParams();
        formData.append('api_key', RUPANTORPAY_API_KEY);
        formData.append('amount', amount.toString());
        formData.append('fullname', customerName || 'Guest');
        formData.append('email', customerEmail || 'guest@example.com');
        formData.append('currency', currency);
        formData.append('success_url', `${SITE_URL}/api/rupantorpay/callback`);
        formData.append('cancel_url', `${SITE_URL}/trade?payment=cancelled`);
        formData.append('webhook_url', `${SITE_URL}/api/rupantorpay/callback`); // For real-time updates

        console.log('Creating RupantorPay charge (Form Data):', Object.fromEntries(formData));

        const response = await fetch(`${RUPANTORPAY_BASE_URL}/payment/checkout?api_key=${RUPANTORPAY_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            const text = await response.text();
            console.error('RupantorPay returned HTML:', text.substring(0, 500));
            return NextResponse.json(
                { error: 'Payment gateway returned an error (HTML response). Check API URL and Key.' },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log('RupantorPay Response:', data);

        if (!response.ok || !data.status) { // Check data.status too
            console.error('RupantorPay error:', data);
            return NextResponse.json(
                { error: data.message || 'Failed to initiate payment' },
                { status: response.status || 400 }
            );
        }

        const paymentUrl = data.payment_url || data.url;
        let transactionId = data.trx_id || data.transaction_id;

        // Extract ID from URL if missing (e.g. .../execute/ID)
        if (!transactionId && paymentUrl) {
            const parts = paymentUrl.split('/');
            transactionId = parts[parts.length - 1];
        }

        return NextResponse.json({
            success: true,
            paymentUrl: paymentUrl,
            transactionId: transactionId,
        });

    } catch (error) {
        console.error('RupantorPay create-charge error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
