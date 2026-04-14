"use client";

import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, title, className = "", style }: CardProps) {
  return (
    <div className={`card ${className}`} style={style}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}
