"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth,
  icon,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses: Record<Size, string> = {
    sm: "px-3 py-[6px] text-[12px] gap-[5px]",
    md: "px-[18px] py-[10px] text-[13px] gap-[6px]",
    lg: "px-6 py-3 text-[14px] gap-2",
  };

  const variantStyles: Record<Variant, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #6B21F0, #8B45FF)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
    },
    secondary: {
      background: "rgba(107, 33, 240, 0.12)",
      color: "var(--c6b)",
      border: "1px solid rgba(139, 69, 255, 0.25)",
      borderRadius: "10px",
    },
    ghost: {
      background: "transparent",
      color: "var(--muted)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
    },
    danger: {
      background: "rgba(224, 82, 82, 0.12)",
      color: "#E05252",
      border: "1px solid rgba(224, 82, 82, 0.25)",
      borderRadius: "10px",
    },
  };

  return (
    <button
      className={`${baseStyle} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
