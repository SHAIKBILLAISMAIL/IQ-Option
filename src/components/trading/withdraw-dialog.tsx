"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Banknote, Landmark, QrCode, Bitcoin, RefreshCw, Zap, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWithdrawSuccess: (amount: number) => void;
  availableBalance: number;
}

const withdrawMethods = [
  {
    id: "instant_bank",
    name: "Bank Transfer",
    icon: Zap,
    description: "Instant (IMPS/NEFT)",
    placeholder: "Enter Account Number & IFSC",
    color: "#00c853",
  },
  {
    id: "upi",
    name: "UPI Transfer",
    icon: QrCode,
    description: "Instant (GPay/PhonePe)",
    placeholder: "Enter UPI ID (e.g. name@okhdfcbank)",
    color: "#ff8516",
  },
  {
    id: "crypto",
    name: "USDT (TRC20)",
    icon: Bitcoin,
    description: "Instant Processing",
    placeholder: "Enter TRC20 Wallet Address",
    color: "#26a17b",
  },
];

type WithdrawHistoryItem = {
  id: number;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  referenceId: string | null;
};

export function WithdrawDialog({ open, onOpenChange, onWithdrawSuccess, availableBalance }: WithdrawDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState("instant_bank");
  const [amount, setAmount] = useState("");
  const [payoutDetails, setPayoutDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<WithdrawHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  useEffect(() => {
    if (open) {
      fetchHistory();
      setSuccessState(false);
      setAmount("");
      setPayoutDetails("");
    }
  }, [open]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch("/api/withdrawals?limit=5");
      if (res.ok) {
        const data = await res.json();
        setHistory(
          data.map((item: any) => ({
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load withdrawal history", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setPayoutDetails("");
    setSelectedMethod("instant_bank");
    setSuccessState(false);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (numericAmount > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }
    if (!payoutDetails.trim()) {
      toast.error("Please provide payout details");
      return;
    }

    setLoading(true);

    // Simulate processing delay for "real-time" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          method: selectedMethod,
          payoutDetails: payoutDetails.trim(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Withdrawal failed");
      }

      setSuccessState(true);
      onWithdrawSuccess(numericAmount);
      fetchHistory();

      // Auto close after success animation
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error(error instanceof Error ? error.message : "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const currentMethod = withdrawMethods.find(m => m.id === selectedMethod);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1d29] border-[#2a2d3a] text-white max-h-[90vh] overflow-y-auto">
        {successState ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#00c853]/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#00c853]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Withdrawal Initiated!</h3>
            <p className="text-gray-400 text-center max-w-xs">
              Your request for <span className="text-white font-bold">${amount}</span> has been processed successfully.
            </p>
            <div className="text-sm text-[#00c853] flex items-center gap-2 bg-[#00c853]/10 px-4 py-2 rounded-full">
              <Zap size={14} />
              <span>Funds sent instantly</span>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Withdraw Funds</DialogTitle>
              <DialogDescription className="text-gray-400">
                Available balance: <span className="text-[#00c853] font-bold">${availableBalance.toFixed(2)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Method Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-300">Select Withdrawal Method</Label>
                <div className="grid grid-cols-1 gap-2">
                  {withdrawMethods.map((method) => {
                    const Icon = method.icon;
                    const isActive = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => {
                          setSelectedMethod(method.id);
                          setPayoutDetails("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all relative overflow-hidden group ${isActive
                          ? "border-[#00c853] bg-[#00c853]/5"
                          : "border-[#2a2d3a] bg-[#0d0f15] hover:border-[#3a3d4a]"
                          }`}
                      >
                        <div className={`p-2.5 rounded-lg transition-colors ${isActive ? "bg-[#00c853] text-white" : "bg-[#1a1d29] text-gray-400 group-hover:text-white"}`}>
                          <Icon size={20} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            {method.name}
                            {method.id.includes('instant') && (
                              <span className="text-[10px] bg-[#ff8516] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                FAST
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{method.description}</div>
                        </div>
                        {isActive && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00c853] shadow-[0_0_10px_#00c853]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-300">Withdrawal Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    min={0}
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-14 pl-8 bg-[#0d0f15] border-[#2a2d3a] text-white text-lg font-bold focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853]"
                  />
                  <button
                    onClick={() => setAmount(availableBalance.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#2a2d3a] hover:bg-[#3a3d4a] text-white px-2 py-1 rounded transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>Min: $10.00</span>
                  <span>Remaining: ${(Math.max(availableBalance - Number(amount || 0), 0)).toFixed(2)}</span>
                </div>
              </div>

              {/* Payout Details */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-300">
                  {selectedMethod === 'upi' ? 'UPI ID' : selectedMethod === 'crypto' ? 'Wallet Address' : 'Bank Details'}
                </Label>
                <Textarea
                  placeholder={currentMethod?.placeholder}
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  className="min-h-[100px] bg-[#0d0f15] border-[#2a2d3a] text-white focus:border-[#00c853] resize-none"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Zap size={12} className="text-[#ff8516]" />
                  Funds are deducted instantly upon request.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading || !amount || !payoutDetails}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#ff8516] to-[#ff9d42] hover:from-[#ff9d42] hover:to-[#ffb066] text-white disabled:opacity-50 shadow-lg shadow-[#ff8516]/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Request...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Withdraw ${amount || '0.00'}
                    <ArrowRight size={20} />
                  </span>
                )}
              </Button>

              {/* Recent History */}
              <div className="pt-4 border-t border-[#2a2d3a]">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-gray-300">Recent Activity</Label>
                  <button
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    onClick={fetchHistory}
                    disabled={historyLoading}
                  >
                    <RefreshCw size={12} className={historyLoading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="text-xs text-gray-500 text-center py-4 bg-[#0d0f15] rounded-lg border border-[#2a2d3a] border-dashed">
                      No recent withdrawals
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#0d0f15] border border-[#2a2d3a] rounded-lg p-3 flex items-center justify-between group hover:border-[#3a3d4a] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-[#00c853]/20 text-[#00c853]' : 'bg-[#ff8516]/20 text-[#ff8516]'
                            }`}>
                            {item.status === 'completed' ? <CheckCircle2 size={14} /> : <Loader2 size={14} className={item.status === 'pending' ? 'animate-spin' : ''} />}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">${item.amount.toFixed(2)}</div>
                            <div className="text-[10px] text-gray-500 uppercase">{item.method.replace('_', ' ')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${item.status === "completed"
                            ? "bg-[#00c853]/10 text-[#00c853]"
                            : item.status === "rejected"
                              ? "bg-[#ff3b30]/10 text-[#ff3b30]"
                              : "bg-[#ff8516]/10 text-[#ff8516]"
                            }`}>
                            {item.status}
                          </div>
                          <div className="text-[10px] text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}