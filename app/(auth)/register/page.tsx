"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Role = "patient" | "doctor" | "admin";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    terms: false,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please create a password.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.terms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Backend registration API yahan connect hogi.
       *
       * Example:
       *
       * await axios.post("YOUR_BACKEND_URL/api/auth/register", {
       *   name: form.name,
       *   email: form.email,
       *   password: form.password,
       *   phone: form.phone,
       *   role,
       * });
       */

      await new Promise((resolve) => setTimeout(resolve, 900));

      // Selected role ke according page open hoga.
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "doctor") {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6f8] text-slate-900">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-slate-200/70 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-slate-300/50 blur-3xl"
        />

        <div className="absolute left-1/2 top-24 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16"
      >
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg"
          >
            <HeartPulse className="h-5 w-5" />
          </motion.div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Clinexa
            </h1>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Healthcare System
            </p>
          </div>
        </Link>

        <Link
          href="/login"
          className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 sm:flex"
        >
          <ArrowLeft className="h-4 w-4" />
          Sign In
        </Link>
      </motion.header>

      {/* Main */}
      <section className="relative z-10 flex justify-center px-5 pb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="w-full max-w-[560px]"
        >
          <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
            <div className="h-1.5 w-full bg-slate-950" />

            <div className="p-7 sm:p-10">
              {/* Heading */}
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <UserRound className="h-6 w-6 text-slate-800" />
                </div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Create Account
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[36px]">
                  Join Clinexa.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Create your account and access a smarter healthcare
                  management experience.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        updateField("email", e.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        updateField("password", e.target.value)
                      }
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 8 characters for better security.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        updateField("phone", e.target.value)
                      }
                      placeholder="+92 300 0000000"
                      autoComplete="tel"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Select Role
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <RoleCard
                      role="patient"
                      selected={role === "patient"}
                      icon={<UserRound className="h-5 w-5" />}
                      title="Patient"
                      onClick={() => setRole("patient")}
                    />

                    <RoleCard
                      role="doctor"
                      selected={role === "doctor"}
                      icon={<Stethoscope className="h-5 w-5" />}
                      title="Doctor"
                      onClick={() => setRole("doctor")}
                    />

                    <RoleCard
                      role="admin"
                      selected={role === "admin"}
                      icon={<ShieldCheck className="h-5 w-5" />}
                      title="Admin"
                      onClick={() => setRole("admin")}
                    />
                  </div>
                </div>

                {/* Selected role */}
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm text-slate-500">
                    You are signing up as:{" "}
                    <span className="font-bold capitalize text-slate-900">
                      {role}
                    </span>
                  </p>
                </motion.div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) =>
                      updateField("terms", e.target.checked)
                    }
                    className="mt-0.5 h-5 w-5 cursor-pointer accent-slate-900"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="font-medium text-slate-900 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="font-medium text-slate-900 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="relative flex items-center gap-3">
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </button>
              </form>

              {/* Login */}
              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-slate-900 transition hover:text-slate-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Security footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Check className="h-3.5 w-3.5" />
            Secure registration powered by Clinexa
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function RoleCard({
  role,
  selected,
  icon,
  title,
  onClick,
}: {
  role: Role;
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex min-h-[112px] flex-col items-center justify-center rounded-2xl border-2 px-2 transition-all duration-300 ${
        selected
          ? "border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-900/15"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <motion.div
        animate={{
          scale: selected ? 1.05 : 1,
        }}
        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${
          selected
            ? "bg-white/10 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </motion.div>

      <span className="text-xs font-semibold">{title}</span>

      {selected && (
        <motion.span
          layoutId="role-dot"
          className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-white"
        />
      )}
    </button>
  );
}