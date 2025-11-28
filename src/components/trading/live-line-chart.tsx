"use client";

import { useEffect, useRef, useState } from 'react';

interface LiveChartProps {
    symbol: string;
    currentPrice: number;
    height?: number;
}

interface PricePoint {
    time: number;
    price: number;
}

export function LiveLineChart({ symbol, currentPrice, height = 400 }: LiveChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    // Add new price point every update
    useEffect(() => {
        if (currentPrice === 0) return;

        const now = Date.now();
        setPriceHistory(prev => {
            const newHistory = [...prev, { time: now, price: currentPrice }];

            // Keep only last 60 seconds of data
            const cutoff = now - 60000;
            const filtered = newHistory.filter(p => p.time > cutoff);

            return filtered;
        });
    }, [currentPrice]);

    // Calculate min/max for scaling
    useEffect(() => {
        if (priceHistory.length === 0) return;

        const prices = priceHistory.map(p => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const padding = (max - min) * 0.1 || 1;

        setMinPrice(min - padding);
        setMaxPrice(max + padding);
    }, [priceHistory]);

    // Draw chart
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || priceHistory.length < 2) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const priceRange = maxPrice - minPrice;

        // Clear canvas
        ctx.fillStyle = '#131722';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#1e222d';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw price line
        if (priceHistory.length > 1) {
            const now = Date.now();
            const timeRange = 60000; // 60 seconds

            ctx.strokeStyle = '#2962ff';
            ctx.lineWidth = 2;
            ctx.beginPath();

            priceHistory.forEach((point, index) => {
                const x = ((point.time - (now - timeRange)) / timeRange) * width;
                const y = height - ((point.price - minPrice) / priceRange) * height;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw current price line
            const lastPoint = priceHistory[priceHistory.length - 1];
            const lastY = height - ((lastPoint.price - minPrice) / priceRange) * height;

            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, lastY);
            ctx.lineTo(width, lastY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw price label
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(width - 80, lastY - 12, 75, 24);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px monospace';
            ctx.fillText(currentPrice.toFixed(2), width - 75, lastY + 4);
        }

        // Draw price scale
        ctx.fillStyle = '#787b86';
        ctx.font = '11px Arial';
        for (let i = 0; i <= 4; i++) {
            const price = minPrice + (priceRange * i / 4);
            const y = height - (height * i / 4);
            ctx.fillText(price.toFixed(2), 5, y - 5);
        }

    }, [priceHistory, minPrice, maxPrice, currentPrice]);

    return (
        <div className="relative w-full bg-[#131722]" style={{ height }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={height}
                className="w-full h-full"
            />

            {/* Live indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1e222d] px-3 py-1.5 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">LIVE</span>
            </div>

            {/* Symbol */}
            <div className="absolute top-4 left-24 bg-[#1e222d] px-3 py-1.5 rounded">
                <span className="text-white text-sm font-medium">{symbol}</span>
            </div>

            {/* Current Price */}
            <div className="absolute top-4 right-4 bg-[#1e222d] px-4 py-1.5 rounded">
                <span className="text-[#26a69a] text-lg font-bold">{currentPrice.toFixed(2)}</span>
            </div>
        </div>
    );
}
