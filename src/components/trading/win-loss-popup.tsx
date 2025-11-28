"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface WinLossPopupProps {
    isOpen: boolean;
    onClose: () => void;
    result: "win" | "loss";
    amount: number;
    asset: string;
}

export function WinLossPopup({ isOpen, onClose, result, amount, asset }: WinLossPopupProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [isOpen, onClose]);

    if (!isOpen && !visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                className={`
          relative bg-[#1e222d] border-2 rounded-lg shadow-2xl p-6 min-w-[300px] text-center transform transition-all duration-500 pointer-events-auto
          ${result === "win" ? "border-[#00c853]" : "border-[#ff3b30]"}
          ${visible ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10"}
        `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                    <X size={16} />
                </button>

                <div className="mb-2 text-sm text-gray-400 uppercase tracking-wider font-bold">
                    {asset}
                </div>

                <div className={`text-3xl font-bold mb-2 ${result === "win" ? "text-[#00c853]" : "text-[#ff3b30]"}`}>
                    {result === "win" ? "YOU WON" : "YOU LOST"}
                </div>

                <div className="text-4xl font-bold text-white mb-4">
                    ${amount.toFixed(2)}
                </div>

                <div className="text-xs text-gray-500">
                    {result === "win" ? "Profit added to balance" : "Amount deducted from balance"}
                </div>
            </div>
        </div>
    );
}
