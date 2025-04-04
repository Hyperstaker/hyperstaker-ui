import React from "react";

interface LinearProgressProps {
  value: number;
  variant?: "determinate" | "indeterminate";
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value = 0,
  variant = "determinate",
  className = "",
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2 w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      {variant === "determinate" ? (
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${clampedValue}%` }}
        />
      ) : (
        <div className="h-full bg-blue-600 rounded-full animate-indeterminate" />
      )}
    </div>
  );
};
