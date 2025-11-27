'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone, QrCode, Wallet } from 'lucide-react';

interface RazorpayPaymentProps {
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function RazorpayPayment({ amount, onSuccess, onCancel }: RazorpayPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        if (!scriptLoaded) {
            toast.error('Payment system is loading, please wait...');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('bearer_token');

            // Create order
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: amount }),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await orderResponse.json();

            // MOCK MODE: Simulate instant payment success
            if (orderData.isMock) {
                toast.info('Mock payment mode - simulating success...');

                // Simulate payment delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Simulate successful payment
                const mockPaymentId = `pay_mock_${Date.now()}`;

                try {
                    // Verify payment (will skip signature check for mock)
                    const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            razorpay_order_id: orderData.orderId,
                            razorpay_payment_id: mockPaymentId,
                            razorpay_signature: 'mock_signature',
                            amount: orderData.amount,
                            paymentMethod: 'razorpay',
                        }),
                    });

                    if (!verifyResponse.ok) {
                        throw new Error('Payment verification failed');
                    }

                    toast.success(`Successfully deposited ₹${amount}!`);
                    onSuccess();
                    setLoading(false);
                    return;
                } catch (error) {
                    console.error('Mock verification error:', error);
                    toast.error('Payment verification failed');
                    setLoading(false);
                    return;
                }
            }

            // Razorpay options
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'IQ Option Trading',
                description: 'Deposit to Trading Account',
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                amount: orderData.amount,
                                paymentMethod: 'razorpay',
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        const verifyData = await verifyResponse.json();
                        toast.success(`Successfully deposited ₹${amount}!`);
                        onSuccess();
                    } catch (error) {
                        console.error('Verification error:', error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#00c853',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.info('Payment cancelled');
                    },
                },
                retry: {
                    enabled: false
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Amount Display */}
            <div className="bg-gradient-to-r from-[#00c853]/20 to-[#00d65f]/20 border border-[#00c853]/30 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Amount to Pay</div>
                <div className="text-4xl font-bold text-[#00c853] mb-1">₹{amount}</div>
                <div className="text-xs text-gray-500">(${(amount / 83).toFixed(2)} USD)</div>
            </div>

            {/* Payment Methods Info */}
            <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-xl p-5">
                <div className="text-sm font-semibold text-white mb-3">Supported Payment Methods:</div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <CreditCard size={18} className="text-[#00c853]" />
                        <span>Credit/Debit Cards</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Smartphone size={18} className="text-[#00c853]" />
                        <span>UPI (Instant)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <QrCode size={18} className="text-[#00c853]" />
                        <span>QR Code</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Wallet size={18} className="text-[#00c853]" />
                        <span>Net Banking</span>
                    </div>
                </div>
            </div>

            {/* Payment Button */}
            <div className="flex gap-3">
                <Button
                    onClick={onCancel}
                    variant="outline"
                    disabled={loading}
                    className="flex-1 h-14 bg-[#1a1d29] border-[#2a2d3a] hover:bg-[#2a2d3a] text-white"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handlePayment}
                    disabled={loading || !scriptLoaded}
                    className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-[#00c853] to-[#00d65f] hover:from-[#00d65f] hover:to-[#00e86f] text-white disabled:opacity-50 shadow-lg shadow-[#00c853]/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : !scriptLoaded ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            Pay ₹{amount}
                        </>
                    )}
                </Button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-[#00c853]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secured by Razorpay • PCI DSS Compliant</span>
            </div>

            {/* Features */}
            <div className="bg-[#0d0f15]/50 border border-[#2a2d3a]/50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                        <div className="text-[#00c853] font-bold text-sm">Instant</div>
                        <div className="text-gray-500 text-xs">Real-time</div>
                    </div>
                    <div>
                        <div className="text-[#00c853] font-bold text-sm">Secure</div>
                        <div className="text-gray-500 text-xs">Encrypted</div>
                    </div>
                    <div>
                        <div className="text-[#00c853] font-bold text-sm">24/7</div>
                        <div className="text-gray-500 text-xs">Available</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
