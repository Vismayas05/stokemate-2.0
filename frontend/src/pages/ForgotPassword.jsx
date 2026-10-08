import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://stokemate-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to process your request."
        );
      }

      setMessage(
        data?.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}

      <header className="flex items-center justify-between border-b border-border px-6 py-5 lg:px-10">
        <BrandLogo />

        <ThemeToggle />
      </header>

      {/* Main */}

      <main className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Icon */}

          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={27} />
            </div>
          </div>

          {/* Heading */}

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter your registered email address and we'll send you
              a secure link to reset your password.
            </p>
          </div>

          {/* Card */}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Email address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-background px-3 transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Mail
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Success */}

              {message && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-5 text-emerald-600 dark:text-emerald-400">
                  {message}
                </div>
              )}

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-500">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>

            {/* Back to login */}

            <div className="mt-6 flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}