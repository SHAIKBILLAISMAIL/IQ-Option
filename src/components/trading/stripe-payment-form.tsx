"use client";

import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface StripePaymentFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onCancel: () => void;
}

export function StripePaymentForm({ amount, onSuccess, onCancel }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/trade?payment=success`,
                },
                redirect: "if_required",
            });

            if (error) {
                toast.error(error.message || "Payment failed");
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                toast.success("Payment successful!");
                onSuccess(paymentIntent.id);
            } else if (paymentIntent && paymentIntent.status === "processing") {
                toast.info("Payment is processing...");
            }
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#00c853]/10 border border-[#00c853]/30 rounded-lg p-4 text-center mb-4">
                <div className="text-sm text-gray-400 mb-1">Amount to Pay</div>
                <div className="text-3xl font-bold text-[#00c853]">${amount.toFixed(2)}</div>
            </div>

            <PaymentElement
                options={{
                    layout: "tabs",
                    defaultValues: {
                        billingDetails: {
                            email: "",
                        }
                    }
                }}
            />

            <div className="flex gap-3">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-[#1a1d29] border-[#2a2d3a] hover:bg-[#2a2d3a] text-white"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || !stripe || !elements}
                    className="flex-1 h-12 text-lg font-bold bg-[#00c853] hover:bg-[#00d65f] text-white disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        `Pay $${amount.toFixed(2)}`
                    )}
                </Button>
            </div>

            <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure payment powered by Stripe
            </div>
        </form>
    );
}
