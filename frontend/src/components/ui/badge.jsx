
import * as React from "react";

const Badge = ({ className = "", variant = "secondary", ...props }) => {
  const variants = {
    default: "bg-emerald-600 text-white",
    secondary: "bg-slate-100 text-slate-700",
    destructive: "bg-red-100 text-red-700",
    outline: "border border-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant] || variants.secondary} ${className}`}
      {...props}
    />
  );
};

export { Badge };