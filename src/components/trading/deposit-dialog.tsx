'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Bitcoin, Building2, Check, Copy, ArrowLeft, QrCode, Wallet, Zap } from 'lucide-react';
import { RazorpayPayment } from './razorpay-payment';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepositSuccess: (amount: number) => void;
}

const paymentMethods = [
  {
    id: 'razorpay',
    name: 'Instant Payment',
    icon: Zap,
    description: 'UPI, Cards, QR Code - Instant',
    minAmount: 100,
  },
  {
    id: 'upi',
    name: 'UPI Payment',
    icon: QrCode,
    description: 'Pay via UPI ID',
    minAmount: 100,
  },
  {
    id: 'crypto',
    name: 'USDT (TRC20)',
    icon: Bitcoin,
    description: 'Crypto deposit',
    minAmount: 10,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Building2,
    description: '1-3 business days',
    minAmount: 100,
  },
];

const quickAmounts = [100, 250, 500, 1000];
const quickAmountsUPI = [300, 500, 1000, 5000];
const quickAmountsUSDT = [50, 100, 500, 1000];

// Demo UPI ID and USDT Wallet (replace with real ones)
const UPI_ID = "merchant@paytm";
const USDT_WALLET = "TXqHvS2VfM4xKzYpN8bC3dE5fG7hJ9kL2m";

// Demo Bank Details
const BANK_DETAILS = {
  bankName: "State Bank of India",
  accountName: "IQ Option Trading Ltd",
  accountNumber: "1234567890123456",
  ifscCode: "SBIN0001234",
  swiftCode: "SBININBB"
};

export function DepositDialog({ open, onOpenChange, onDepositSuccess }: DepositDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'payment' | 'verify'>('select');
  const [utr, setUtr] = useState('');
  const [clientSecret, setClientSecret] = useState<string>('');

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };



  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (selectedPaymentMethod && depositAmount < selectedPaymentMethod.minAmount) {
      toast.error(`Minimum deposit amount is ₹${selectedPaymentMethod.minAmount}`);
      return;
    }

    // For Razorpay (instant payment), go directly to payment step
    setStep('payment');
  };

  const handleRazorpaySuccess = () => {
    const depositAmount = parseFloat(amount);
    onDepositSuccess(depositAmount);
    handleClose();
  };

  const handleVerifyPayment = async () => {
    if (!utr.trim()) {
      toast.error('Please enter the transaction reference number');
      return;
    }

    const depositAmount = parseFloat(amount);
    await processDeposit(depositAmount, utr, 'pending');
  };

  const processDeposit = async (depositAmount: number, transactionRef: string, initialStatus: 'pending' | 'completed' = 'pending') => {
    setLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');

      // Create deposit record
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: depositAmount,
          currency: selectedMethod === 'crypto' ? 'USDT' : 'USD',
          paymentMethod: selectedMethod,
          transactionId: transactionRef,
          status: initialStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Deposit failed');
      }

      // If payment is completed (Stripe), update balance immediately
      if (initialStatus === 'completed') {
        const balanceResponse = await fetch('/api/user/balance', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          const newRealBalance = balanceData.realBalance + depositAmount;

          await fetch('/api/user/balance', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ realBalance: newRealBalance }),
          });
        }

        toast.success(`Successfully deposited $${depositAmount.toFixed(2)}`);
        onDepositSuccess(depositAmount);
      } else {
        // For manual verification methods
        toast.success('Deposit request submitted. Awaiting verification.');
      }

      handleClose();
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error instanceof Error ? error.message : 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setAmount('');
    setUtr('');
    setClientSecret('');
    onOpenChange(false);
  };

  const getQuickAmounts = () => {
    if (selectedMethod === 'upi') return quickAmountsUPI;
    if (selectedMethod === 'crypto') return quickAmountsUSDT;
    return quickAmounts;
  };

  const renderSelectStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">Deposit Funds</DialogTitle>
        <DialogDescription className="text-gray-400">
          Add funds to your real trading account
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        {/* Payment Methods */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-300">Payment Method</Label>
          <div className="grid gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isActive = selectedMethod === method.id;
              const isRazorpayGroup = method.id === 'razorpay' || method.id === 'bank_transfer' || method.id === 'upi';

              return (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setAmount('');
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isActive
                    ? 'border-[#00c853] bg-[#00c853]/10'
                    : 'border-[#2a2d3a] bg-[#0d0f15] hover:border-[#3a3d4a]'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-[#00c853]' : 'bg-[#2a2d3a]'}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{method.name}</div>
                    <div className="text-xs text-gray-400">{method.description}</div>
                  </div>
                  {isRazorpayGroup && (
                    <div className="ml-auto">
                      <span className="text-[10px] bg-[#00c853] text-white px-1.5 py-0.5 rounded font-bold uppercase">INSTANT</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-semibold text-gray-300">
            Amount ({selectedMethod === 'crypto' ? 'USDT' : 'USD'})
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 h-12 text-lg bg-[#0d0f15] border-[#2a2d3a] text-white focus:border-[#00c853]"
              min={selectedPaymentMethod?.minAmount || 0}
              step="0.01"
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-300">Quick Select</Label>
          <div className="grid grid-cols-4 gap-2">
            {getQuickAmounts().map((quickAmount) => (
              <Button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                variant="outline"
                size="sm"
                className={`bg-[#0d0f15] border-[#2a2d3a] hover:border-[#00c853] hover:bg-[#00c853]/10 ${amount === quickAmount.toString() ? 'border-[#00c853] bg-[#00c853]/10' : ''
                  }`}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>

        {/* Deposit Button */}
        <Button
          onClick={handleDeposit}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full h-12 text-lg font-bold bg-[#00c853] hover:bg-[#00d65f] text-white disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Continue to Pay $${parseFloat(amount || '0').toFixed(2)}`}
        </Button>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          🔒 Secure payment processing
        </div>
      </div>
    </>
  );

  const renderRazorpayPayment = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('select')}
            className="p-1 hover:bg-[#2a2d3a] rounded"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <DialogTitle className="text-xl font-bold text-white">Instant Payment</DialogTitle>
        </div>
        <DialogDescription className="text-gray-400">
          Pay instantly with UPI, Cards, or QR Code
        </DialogDescription>
      </DialogHeader>

      <div className="py-2">
        <RazorpayPayment
          amount={parseFloat(amount) * 83} // Convert USD to INR
          onSuccess={handleRazorpaySuccess}
          onCancel={() => setStep('select')}
        />
      </div>
    </>
  );


  const renderBankTransfer = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('select')}
            className="p-1 hover:bg-[#2a2d3a] rounded"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <DialogTitle className="text-xl font-bold text-white">Bank Transfer</DialogTitle>
        </div>
        <DialogDescription className="text-gray-400">
          Transfer ${amount} to complete your deposit
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Amount Display */}
        <div className="bg-[#00c853]/10 border border-[#00c853]/30 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Amount to Transfer</div>
          <div className="text-3xl font-bold text-[#00c853]">${amount}</div>
        </div>

        {/* Bank Details */}
        <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-300 mb-3">Bank Details</div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Bank Name</span>
            <span className="text-white font-medium">{BANK_DETAILS.bankName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Account Name</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{BANK_DETAILS.accountName}</span>
              <button onClick={() => handleCopy(BANK_DETAILS.accountName, 'Account name')}>
                <Copy size={14} className="text-gray-500 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono">{BANK_DETAILS.accountNumber}</span>
              <button onClick={() => handleCopy(BANK_DETAILS.accountNumber, 'Account number')}>
                <Copy size={14} className="text-gray-500 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">IFSC Code</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono">{BANK_DETAILS.ifscCode}</span>
              <button onClick={() => handleCopy(BANK_DETAILS.ifscCode, 'IFSC code')}>
                <Copy size={14} className="text-gray-500 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">SWIFT Code</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono">{BANK_DETAILS.swiftCode}</span>
              <button onClick={() => handleCopy(BANK_DETAILS.swiftCode, 'SWIFT code')}>
                <Copy size={14} className="text-gray-500 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
          ⚠️ Please transfer the exact amount. Processing time: 1-3 business days.
        </div>

        {/* Transaction Reference Input */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-300">
            Transaction Reference Number
          </Label>
          <Input
            type="text"
            placeholder="Enter bank transaction reference..."
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            className="h-12 bg-[#0d0f15] border-[#2a2d3a] text-white focus:border-[#00c853]"
          />
          <p className="text-xs text-gray-500">
            Enter the reference number after completing the bank transfer
          </p>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyPayment}
          disabled={loading || !utr.trim()}
          className="w-full h-12 text-lg font-bold bg-[#00c853] hover:bg-[#00d65f] text-white disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Confirm Transfer'}
        </Button>

        {/* Steps */}
        <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-4 text-sm">
          <div className="font-semibold text-gray-300 mb-2">How to Transfer:</div>
          <ol className="space-y-1 text-gray-400 list-decimal list-inside">
            <li>Copy the bank details above</li>
            <li>Open your banking app or visit your bank</li>
            <li>Transfer the exact amount shown</li>
            <li>Enter the transaction reference above</li>
            <li>Click Confirm Transfer</li>
          </ol>
        </div>
      </div>
    </>
  );

  const renderUPIPayment = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('select')}
            className="p-1 hover:bg-[#2a2d3a] rounded"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <DialogTitle className="text-xl font-bold text-white">UPI Payment</DialogTitle>
        </div>
        <DialogDescription className="text-gray-400">
          Send ₹{(parseFloat(amount) * 83).toFixed(0)} to complete your deposit
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Amount Display */}
        <div className="bg-[#00c853]/10 border border-[#00c853]/30 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Amount to Pay</div>
          <div className="text-3xl font-bold text-[#00c853]">
            ₹{(parseFloat(amount) * 83).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">(${amount} USD)</div>
        </div>

        {/* UPI ID */}
        <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">UPI ID</div>
          <div className="flex items-center justify-between">
            <code className="text-white font-mono text-lg">{UPI_ID}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(UPI_ID, 'UPI ID')}
              className="bg-[#2a2d3a] border-[#3a3d4a] hover:bg-[#3a3d4a]"
            >
              <Copy size={14} className="mr-1" /> Copy
            </Button>
          </div>
        </div>

        {/* Pay Now Button (Deep Link) */}
        <a
          href={`upi://pay?pa=${UPI_ID}&cu=INR&am=${(parseFloat(amount) * 83).toFixed(0)}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-center transition-all"
        >
          <Wallet size={18} />
          Pay Now With UPI App
        </a>

        {/* UTR Input */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-300">
            Enter UPI Reference Number (UTR)
          </Label>
          <Input
            type="text"
            placeholder="Enter 12-digit UTR number..."
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            className="h-12 bg-[#0d0f15] border-[#2a2d3a] text-white focus:border-[#00c853]"
          />
          <p className="text-xs text-gray-500">
            You can find UTR in your UPI app payment history
          </p>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyPayment}
          disabled={loading || !utr.trim()}
          className="w-full h-12 text-lg font-bold bg-[#00c853] hover:bg-[#00d65f] text-white disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Complete Deposit'}
        </Button>

        {/* Steps */}
        <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-4 text-sm">
          <div className="font-semibold text-gray-300 mb-2">How to Pay:</div>
          <ol className="space-y-1 text-gray-400 list-decimal list-inside">
            <li>Copy UPI ID or click "Pay Now With UPI App"</li>
            <li>Complete payment in your UPI app</li>
            <li>Copy the UTR/Reference number</li>
            <li>Paste it above and click Verify</li>
          </ol>
        </div>
      </div>
    </>
  );

  const renderCryptoPayment = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('select')}
            className="p-1 hover:bg-[#2a2d3a] rounded"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <DialogTitle className="text-xl font-bold text-white">USDT Payment (TRC20)</DialogTitle>
        </div>
        <DialogDescription className="text-gray-400">
          Send {amount} USDT to complete your deposit
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Amount Display */}
        <div className="bg-[#ff8516]/10 border border-[#ff8516]/30 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Amount to Send</div>
          <div className="text-3xl font-bold text-[#ff8516]">
            {amount} USDT
          </div>
          <div className="text-xs text-gray-500 mt-1">Network: TRC20 (Tron)</div>
        </div>

        {/* Wallet Address */}
        <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
          <div className="flex items-center gap-2">
            <code className="text-white font-mono text-xs break-all flex-1">{USDT_WALLET}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(USDT_WALLET, 'Wallet address')}
              className="bg-[#2a2d3a] border-[#3a3d4a] hover:bg-[#3a3d4a] shrink-0"
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          ⚠️ Only send USDT on TRC20 network. Sending other tokens or using wrong network will result in loss of funds.
        </div>

        {/* Transaction Hash Input */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-300">
            Transaction Hash / Reference
          </Label>
          <Input
            type="text"
            placeholder="Enter transaction hash..."
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            className="h-12 bg-[#0d0f15] border-[#2a2d3a] text-white focus:border-[#00c853] font-mono text-sm"
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyPayment}
          disabled={loading || !utr.trim()}
          className="w-full h-12 text-lg font-bold bg-[#00c853] hover:bg-[#00d65f] text-white disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Complete Deposit'}
        </Button>

        {/* Steps */}
        <div className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-4 text-sm">
          <div className="font-semibold text-gray-300 mb-2">How to Pay:</div>
          <ol className="space-y-1 text-gray-400 list-decimal list-inside">
            <li>Copy the wallet address above</li>
            <li>Open your crypto wallet (Trust, Binance, etc.)</li>
            <li>Send exact USDT amount on TRC20 network</li>
            <li>Copy transaction hash and paste above</li>
            <li>Click Verify to complete deposit</li>
          </ol>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-[#1a1d29] border-[#2a2d3a] text-white max-h-[90vh] overflow-y-auto z-100">
        {step === 'select' && renderSelectStep()}
        {step === 'payment' && (selectedMethod === 'razorpay' || selectedMethod === 'bank_transfer' || selectedMethod === 'upi') && renderRazorpayPayment()}
        {/* {step === 'payment' && selectedMethod === 'bank_transfer' && renderBankTransfer()} */}
        {/* {step === 'payment' && selectedMethod === 'upi' && renderUPIPayment()} */}
        {step === 'payment' && selectedMethod === 'crypto' && renderCryptoPayment()}
      </DialogContent>
    </Dialog>
  );
}
