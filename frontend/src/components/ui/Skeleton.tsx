"use client";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={`rounded-md ${className}`}
      style={{
        width,
        height,
        background: "var(--border-muted)",
      }}
    />
  );
}
