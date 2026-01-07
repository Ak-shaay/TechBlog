import React from "react";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src="/icon.png"
      alt="TechTrendsAI Logo"
      className={className + " object-contain"}
      style={{ borderRadius: 6, background: "#fff" }}
      draggable={false}
    />
  );
}
