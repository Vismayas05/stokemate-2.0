
import { Package } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function BrandLogo({ light = false }) {
  const { theme } = useTheme();

  const isLightText = light || theme === "dark";

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
        <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-emerald-300/30" />

        <Package
          size={24}
          strokeWidth={2.2}
          className="relative z-10 text-white"
        />
      </div>

      {/* Logo Text */}
      <div>
        <h1
          className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
            isLightText ? "text-white" : "text-slate-900"
          }`}
        >
          Stock<span className="text-emerald-500">Mate</span>
        </h1>

        <p
          className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
            isLightText
              ? "text-slate-400"
              : "text-muted-foreground"
          }`}
        >
          Inventory simplified
        </p>
      </div>
    </div>
  );
}

export default BrandLogo;