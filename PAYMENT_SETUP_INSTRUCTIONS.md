# Payment System Setup Instructions

To enable real-time payments with Razorpay, you must configure your API keys.

1.  **Get your Keys:**
    *   Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
    *   Go to **Settings** -> **API Keys**.
    *   Generate a **Test Key** (for development) or **Live Key** (for production).

2.  **Update Configuration:**
    *   Open the file `.env.local` in your project root.
    *   Replace the placeholder values with your actual keys:

    ```env
    RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
    RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
    NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
    ```

3.  **Restart Server:**
    *   After saving the file, restart your development server:
        `npm run dev`

Once these steps are completed, the "Payment system configuration error" will disappear, and you will be able to process payments.
