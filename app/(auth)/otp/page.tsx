"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
      return;
    }

    // Handle pasted/multiple digits
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split("");
      const updated = [...otp];

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          updated[index + i] = digit;
        }
      });

      setOtp(updated);

      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otp];
    updated[index] = cleanValue;
    setOtp(updated);
    setError("");

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updated = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      updated[index] = digit;
    });

    setOtp(updated);
    setError("");

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Backend API will be connected here.
       *
       * Example later:
       * await axios.post("/api/auth/verify-otp", {
       *   otp: code,
       * });
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSuccess("OTP verified successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;

    setError("");
    setSuccess("");
    setResending(true);

    try {
      /*
       * Backend resend OTP API will be connected here.
       */

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOtp(["", "", "", "", "", ""]);
      setSeconds(60);
      setSuccess("A new verification code has been sent.");

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setError("Unable to resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f6f8] text-slate-900">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-slate-200/70 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-slate-300/50 blur-3xl"
        />

        <div className="absolute left-1/2 top-28 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
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
            whileHover={{ scale: 1.06 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15"
          >
            <span className="text-lg font-bold">C</span>
          </motion.div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Clinexa
            </h1>

            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Healthcare
            </p>
          </div>
        </Link>

        <Link
          href="/login"
          className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 sm:flex"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </motion.header>

      {/* Content */}
      <section className="relative z-10 flex min-h-[calc(100vh-105px)] items-center justify-center px-5 pb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="w-full max-w-[500px]"
        >
          <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.11)]">
            {/* Top line */}
            <div className="h-1.5 w-full bg-slate-950" />

            <div className="p-7 sm:p-10">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.45,
                }}
                className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100"
              >
                <ShieldCheck className="h-7 w-7 text-slate-800" />
              </motion.div>

              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Secure Verification
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[35px]">
                  Verify your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter the 6-digit verification code sent to your
                  email address.
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerify}>
                <div className="mb-7">
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Verification Code
                  </label>

                  <div className="flex justify-between gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.12 + index * 0.06,
                        }}
                        value={digit}
                        onChange={(e) =>
                          handleChange(index, e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(index, e)
                        }
                        onPaste={handlePaste}
                        inputMode="numeric"
                        maxLength={6}
                        aria-label={`OTP digit ${index + 1}`}
                        className={`h-14 w-full rounded-2xl border bg-slate-50 text-center text-xl font-bold text-slate-900 outline-none transition-all duration-300 sm:h-16 ${
                          digit
                            ? "border-slate-400 bg-white shadow-sm"
                            : "border-slate-200"
                        } focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-100`}
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />

                  {seconds > 0 ? (
                    <span>
                      Resend code in{" "}
                      <span className="font-semibold text-slate-800">
                        {seconds}s
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="font-semibold text-slate-900 transition hover:text-slate-500 disabled:opacity-50"
                    >
                      {resending ? "Sending..." : "Resend code"}
                    </button>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Success */}
                {success && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {success}
                  </motion.div>
                )}

                {/* Verify */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-13 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="relative">
                      Verify Code
                    </span>
                  )}
                </button>
              </form>

              {/* Help */}
              <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Keep your code private
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Clinexa will never ask you to share your
                      verification code with anyone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login */}
              <p className="mt-7 text-center text-sm text-slate-500">
                Already verified?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-slate-900 transition hover:text-slate-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Secure verification by Clinexa</span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}