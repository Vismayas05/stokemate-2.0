import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  LogOut,
  Save,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";

function Settings() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("stockmate-user") || "{}"
  );

  const [name, setName] = useState(
    savedUser.name ||
      localStorage.getItem("stockmate-name") ||
      ""
  );

  const [email] = useState(
    savedUser.email ||
      localStorage.getItem("stockmate-email") ||
      ""
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // -----------------------------------
  // SAVE PROFILE
  // -----------------------------------

  const handleProfileSave = (event) => {
    event.preventDefault();

    setProfileMessage("");
    setError("");

    if (!name.trim()) {
      setProfileMessage("Please enter your name.");
      return;
    }

    const updatedName = name.trim();

    localStorage.setItem("stockmate-name", updatedName);
    localStorage.setItem("stockmate-email", email);

    const updatedUser = {
      ...savedUser,
      name: updatedName,
      email,
    };

    localStorage.setItem(
      "stockmate-user",
      JSON.stringify(updatedUser)
    );

    setName(updatedName);
    setProfileMessage("Profile updated successfully.");
  };

  // -----------------------------------
  // RESET PASSWORD
  // -----------------------------------

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError("Email not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://stokemate-backend.onrender.com/api/auth/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Password reset failed."
        );
      }

      setPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password reset successfully."
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // DELETE ACCOUNT
  // -----------------------------------

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    if (!email) {
      setError("Email not found. Please log in again.");
      return;
    }

    const enteredEmail = window.prompt(
      "Enter your email address to confirm account deletion:"
    );

    const normalizedEmail = email.trim().toLowerCase();

    if (
      !enteredEmail ||
      enteredEmail.trim().toLowerCase() !== normalizedEmail
    ) {
      window.alert(
        "Email does not match. Account deletion cancelled."
      );
      return;
    }

    setDeleteLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://stokemate-backend.onrender.com/api/auth/delete-account",
        {
          method: "DELETE",
          headers: {
            "X-User-Email": normalizedEmail,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Account deletion failed."
        );
      }

      // Clear account-related local storage
      localStorage.removeItem("stockmate-user");
      localStorage.removeItem("stockmate-name");
      localStorage.removeItem("stockmate-email");

      // Clear user-specific sales data
      localStorage.removeItem(
        `stockmate-sales-${normalizedEmail}`
      );

      window.alert(
        "Your account has been deleted successfully."
      );

      navigate("/");
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete account. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // -----------------------------------
  // LOGOUT
  // -----------------------------------

  const handleLogout = () => {
    localStorage.removeItem("stockmate-user");
    localStorage.removeItem("stockmate-name");
    localStorage.removeItem("stockmate-email");

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground transition-colors duration-300 sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <Link
              to="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:bg-muted"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Settings
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage your StockMate account
              </p>
            </div>

          </div>

          <ThemeToggle />
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* PROFILE SECTION */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <User size={21} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Profile Information
                </h2>

                <p className="text-xs text-muted-foreground">
                  Update your personal details
                </p>
              </div>

            </div>

            <form
              onSubmit={handleProfileSave}
              className="space-y-5"
            >

              {/* FULL NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-background px-3 focus-within:border-emerald-500">

                  <User
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setProfileMessage("");
                    }}
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-sm outline-none"
                    required
                  />

                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-muted/40 px-3">

                  <Mail
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-transparent text-sm outline-none"
                  />

                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* SAVE BUTTON */}

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Save size={17} />
                Save Profile
              </button>

              {/* SUCCESS MESSAGE */}

              {profileMessage && (
                <p className="flex items-center gap-2 text-sm text-emerald-500">
                  <CheckCircle size={16} />
                  {profileMessage}
                </p>
              )}

            </form>
          </motion.section>

          {/* PASSWORD SECTION */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                <KeyRound size={21} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Change Password
                </h2>

                <p className="text-xs text-muted-foreground">
                  Update your account password
                </p>
              </div>

            </div>

            <form
              onSubmit={handlePasswordReset}
              className="space-y-5"
            >

              {/* NEW PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  New Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-background px-3 focus-within:border-emerald-500">

                  <Lock
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordMessage("");
                      setError("");
                    }}
                    placeholder="Enter new password"
                    className="w-full bg-transparent text-sm outline-none"
                    minLength={6}
                    required
                  />

                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-background px-3 focus-within:border-emerald-500">

                  <Lock
                    size={18}
                    className="text-muted-foreground"
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setPasswordMessage("");
                      setError("");
                    }}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent text-sm outline-none"
                    minLength={6}
                    required
                  />

                </div>
              </div>

              {/* UPDATE PASSWORD BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock size={17} />

                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>

              {/* PASSWORD SUCCESS MESSAGE */}

              {passwordMessage && (
                <p className="flex items-center gap-2 text-sm text-emerald-500">
                  <CheckCircle size={16} />
                  {passwordMessage}
                </p>
              )}

            </form>
          </motion.section>

        </div>

        {/* SECURITY INFORMATION */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-start gap-3">

            <ShieldCheck
              size={22}
              className="mt-1 text-emerald-500"
            />

            <div>
              <h2 className="font-semibold">
                Account Security
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your password is securely updated through the
                StockMate backend. Never share your password
                with anyone.
              </p>
            </div>

          </div>
        </motion.section>

        {/* DELETE ACCOUNT */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 rounded-2xl border border-red-500/20 bg-card p-6"
        >
          <div className="flex items-start gap-3">

            <Trash2
              size={22}
              className="mt-1 text-red-500"
            />

            <div className="flex-1">

              <h2 className="font-semibold text-red-500">
                Delete Account
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Permanently delete your account and all
                associated inventory data.
              </p>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={17} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Account"}
              </button>

            </div>
          </div>
        </motion.section>

        {/* LOGOUT BUTTON */}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Logout
        </motion.button>

      </div>
    </main>
  );
}

export default Settings;
