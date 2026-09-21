
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ScanLine,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useInventory } from "../context/InventoryContext";

function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { switchUser } = useInventory();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    try {
      const response = await fetch(
        "https://stokemate-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const responseText = await response.text();

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message: responseText,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      // Save complete login response
      localStorage.setItem(
        "stockmate-user",
        JSON.stringify(data)
      );

      // Get profile details from backend or signup storage
      const savedName =
        data?.name ||
        data?.user?.name ||
        localStorage.getItem("stockmate-name");

      const savedEmail = (
        data?.email ||
        data?.user?.email ||
        email
      ).trim().toLowerCase();

      if (savedName) {
        localStorage.setItem(
          "stockmate-name",
          savedName
        );
      }

      // Save current logged-in user's email
      localStorage.setItem(
        "stockmate-email",
        savedEmail
      );

      // Clear old user's products and load
      // the current user's products
      switchUser(savedEmail);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background p-3 text-foreground transition-colors duration-300 sm:p-5">

      {/* Background Effects */}

      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
      />

      {/* Main Container */}

      <div className="relative mx-auto grid min-h-[calc(100vh-24px)] max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl sm:min-h-[calc(100vh-40px)] lg:grid-cols-[1.05fr_0.95fr]">

        {/* Visual Panel */}

        <section
          className={`relative hidden overflow-hidden p-10 transition-colors duration-500 lg:flex lg:flex-col lg:justify-between ${
            isDark
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-900"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_35%)]"
                : "bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.16),transparent_35%)]"
            }`}
          />

          <div
            className={`absolute inset-0 opacity-[0.07] ${
              isDark
                ? "[background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)]"
                : "[background-image:linear-gradient(#64748b_1px,transparent_1px),linear-gradient(90deg,#64748b_1px,transparent_1px)]"
            } [background-size:40px_40px]`}
          />

          <div className="relative z-10">
            <BrandLogo light={isDark} />

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-24 max-w-lg"
            >
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isDark
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-emerald-600/20 bg-emerald-500/10 text-emerald-700"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Intelligent inventory workspace
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight">
                Everything in
                <br />
                <span className="text-emerald-500">
                  its place.
                </span>
              </h2>

              <p
                className={`mt-6 max-w-md text-sm leading-7 ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                Track products, manage stock, and understand
                your business through a simple and organized
                inventory system.
              </p>
            </motion.div>
          </div>

          {/* Animated Cards */}

          <div className="relative z-10 mt-12 h-64">
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -7 }}
              animate={{ opacity: 1, y: 0, rotate: -7 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -8, rotate: -3 }}
              className={`absolute left-2 top-2 w-60 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl ${
                isDark
                  ? "border-white/10 bg-white/[0.07]"
                  : "border-slate-300 bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-500">
                  <Boxes size={23} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                  Inventory
                </span>
              </div>

              <p
                className={`mt-5 text-xs ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Inventory control
              </p>

              <p className="mt-1 text-xl font-bold">
                Stock Overview
              </p>

              <div className="mt-5 flex gap-1">
                {Array.from({ length: 8 }).map(
                  (_, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 8 }}
                      animate={{
                        height: [8, 20 + index * 4, 12],
                      }}
                      transition={{
                        duration: 2,
                        delay: index * 0.08,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="flex-1 rounded-full bg-emerald-500"
                    />
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 8 }}
              animate={{ opacity: 1, y: 0, rotate: 8 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ y: -8, rotate: 4 }}
              className={`absolute right-2 top-20 w-60 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl ${
                isDark
                  ? "border-white/10 bg-white/[0.07]"
                  : "border-slate-300 bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-500">
                  <TrendingUp size={23} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-500">
                  Analytics
                </span>
              </div>

              <p
                className={`mt-5 text-xs ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Business insights
              </p>

              <p className="mt-1 text-xl font-bold">
                Performance
              </p>

              <div className="mt-5 flex items-end gap-1">
                {[25, 38, 30, 55, 42, 70, 58, 88].map(
                  (height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{
                        duration: 0.7,
                        delay: 0.6 + index * 0.08,
                      }}
                      className="flex-1 rounded-t-md bg-cyan-500/70"
                    />
                  )
                )}
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck
              size={15}
              className="text-emerald-500"
            />
            Built for simple and organized business management
          </div>
        </section>

        {/* Login Panel */}

        <section className="relative flex items-center justify-center overflow-hidden bg-background px-6 py-12 transition-colors duration-300 sm:px-12">

          <div className="absolute right-5 top-5 z-20">
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            <div className="mb-12 lg:hidden">
              <BrandLogo />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <ScanLine size={27} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                Welcome back
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                Sign in to StockMate
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your inventory workspace is waiting for you.
              </p>
            </motion.div>

            {/* Login Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Email address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-card px-3 transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Mail
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-card px-3 transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <LockKeyhole
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}

              {error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </p>
              )}

              {/* Submit Button */}

              <motion.button
                whileHover={{
                  scale: loading ? 1 : 1.015,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Continue to workspace"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </motion.button>
            </form>

            {/* Divider */}

            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
                OR
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Signup */}

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-bold text-emerald-500 transition hover:text-emerald-600"
              >
                Create account
              </Link>
            </p>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} />
              Secure workspace access
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default Login;
