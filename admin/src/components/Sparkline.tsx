"use client";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  filled?: boolean;
}

export default function Sparkline({
  data,
  color = "#FC682C",
  height = 32,
  width = 100,
  filled = true,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

  // Trend indicator
  const trend = data[data.length - 1] > data[0] ? "up" : data[data.length - 1] < data[0] ? "down" : "flat";
  const trendColor = trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#6b7280";

  return (
    <div className="relative group">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={`sparkline-gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Filled Area */}
        {filled && (
          <path
            d={fillD}
            fill={`url(#sparkline-gradient-${color.replace("#", "")})`}
          />
        )}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />

        {/* End Point */}
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="3"
          fill={trendColor}
          className="animate-pulse"
        />
      </svg>

      {/* Trend Badge */}
      <div
        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
          trend === "up" ? "bg-emerald-500/20 text-emerald-400" :
          trend === "down" ? "bg-red-500/20 text-red-400" :
          "bg-gray-500/20 text-gray-400"
        }`}
      >
        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
      </div>
    </div>
  );
}
