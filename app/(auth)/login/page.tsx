"use client";

import React, { useState, FormEvent, useId } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Enter your email.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/dashboard");
      } else {
        setFormError(data.message || "Invalid email or password");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        .clx-input:focus-visible,
        .clx-btn:focus-visible,
        .clx-link:focus-visible,
        .clx-checkbox:focus-visible {
          outline: 1.5px solid #C6A15B;
          outline-offset: 3px;
        }
        .clx-eye:focus-visible {
          outline: 1.5px solid #C6A15B;
          outline-offset: 2px;
          border-radius: 4px;
        }
        .clx-input {
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .clx-input:hover {
          border-color: rgba(198,161,91,0.45);
        }
        .clx-submit {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .clx-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 16px 32px -16px rgba(198,161,91,0.5);
        }
        .clx-submit::after {
          content: "";
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: skewX(-18deg);
          transition: left 0.6s ease;
        }
        .clx-submit:hover:not(:disabled)::after { left: 130%; }
        @keyframes clx-spin { to { transform: rotate(360deg); } }
        .clx-spinner { animation: clx-spin 0.8s linear infinite; }
        @media (max-width: 480px) {
          .clx-card { padding: 40px 28px !important; }
        }
      `}</style>

      <div style={styles.vignette} aria-hidden="true" />

      <div style={styles.card} className="clx-card">
        <div style={styles.mark}>
          <span style={styles.wordmark}>Clinexa</span>
          <Seal />
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {formError && <div role="alert" style={styles.formAlert}>{formError}</div>}

          <div style={styles.field}>
            <label htmlFor={emailId} style={styles.label}>Email</label>
            <input
              id={emailId}
              type="email"
              placeholder="you@clinexa.com"
              autoComplete="username"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
              className="clx-input"
              style={{ ...styles.input, borderColor: errors.email ? "#B4453A" : "rgba(198,161,91,0.28)" }}
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.field}>
            <label htmlFor={passwordId} style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                className="clx-input"
                style={{ ...styles.input, paddingRight: 42, borderColor: errors.password ? "#B4453A" : "rgba(198,161,91,0.28)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="clx-eye"
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          <label style={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#C6A15B", width: 14, height: 14 }}
            />
            Keep me signed in
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="clx-btn clx-submit"
            style={{ ...styles.submit, opacity: submitting ? 0.75 : 1 }}
          >
            {submitting ? (
              <span style={styles.submitContent}><Spinner />Signing in</span>
            ) : (
              "SIGN IN"
            )}
          </button>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); }}
            className="clx-link"
            style={styles.forgotBelow}
          >
            Forgot your password?
          </a>
        </form>

        <p style={styles.footNote}>Trusted by independent practices since 2019</p>
      </div>
    </div>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 220 20" width="140" height="14" style={{ display: "block", margin: "14px auto 0" }} aria-hidden="true">
      <line x1="0" y1="10" x2="95" y2="10" stroke="rgba(198,161,91,0.3)" strokeWidth="1" />
      <line x1="125" y1="10" x2="220" y2="10" stroke="rgba(198,161,91,0.3)" strokeWidth="1" />
      <line x1="0" y1="10" x2="95" y2="10" stroke="#C6A15B" strokeWidth="1" />
      <line x1="220" y1="10" x2="125" y2="10" stroke="#C6A15B" strokeWidth="1" />
      <rect x="106" y="6" width="8" height="8" transform="rotate(45 110 10)" fill="#C6A15B" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="clx-spinner" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="rgba(255,253,248,0.35)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5" />
      <path d="M6.6 6.7C4.5 8 3 12 3 12s3.5 7 10 7c1.8 0 3.3-.5 4.6-1.2" />
      <path d="M17.2 17.2C19.7 15.4 21 12 21 12s-1.6-3.4-4.7-5.4" />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'Manrope', sans-serif",
    background: "#F7F3EA",
    color: "#241E17",
    overflow: "hidden",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(720px 480px at 50% 8%, rgba(198,161,91,0.14) 0%, transparent 60%), radial-gradient(900px 700px at 50% 100%, rgba(198,161,91,0.08) 0%, transparent 60%)",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    padding: "52px 44px 40px",
    background: "#FFFDF8",
    border: "1px solid rgba(198,161,91,0.3)",
    borderRadius: 4,
    boxShadow: "0 40px 90px -30px rgba(36,30,23,0.18)",
    textAlign: "center",
  },
  mark: { display: "flex", flexDirection: "column", alignItems: "center" },
  wordmark: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 500,
    fontSize: 30,
    letterSpacing: "0.06em",
    color: "#241E17",
  },
  tagline: {
    fontSize: 12,
    letterSpacing: "0.08em",
    color: "rgba(36,30,23,0.55)",
    margin: "20px 0 34px",
  },
  form: { display: "flex", flexDirection: "column", gap: 18, textAlign: "left" },
  formAlert: {
    background: "rgba(180,69,58,0.12)",
    border: "1px solid rgba(180,69,58,0.3)",
    color: "#E1998F",
    fontSize: 12.5,
    padding: "9px 12px",
    borderRadius: 3,
  },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(36,30,23,0.55)",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 4px",
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid rgba(198,161,91,0.4)",
    fontSize: 14.5,
    fontFamily: "'Manrope', sans-serif",
    color: "#241E17",
    outline: "none",
    borderRadius: 0,
  },
  errorText: { fontSize: 11.5, color: "#B4453A" },
  passwordWrap: { position: "relative", display: "flex", alignItems: "center" },
  eyeBtn: {
    position: "absolute",
    right: 4,
    background: "none",
    border: "none",
    color: "rgba(36,30,23,0.4)",
    cursor: "pointer",
    display: "flex",
    padding: 4,
  },
  remember: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12.5,
    color: "rgba(36,30,23,0.65)",
  },
  forgotBelow: {
    display: "block",
    textAlign: "center",
    marginTop: 4,
    fontSize: 11.5,
    color: "rgba(36,30,23,0.55)",
    textDecoration: "none",
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  submit: {
    marginTop: 10,
    padding: "13px 18px",
    border: "1px solid #B08A45",
    borderRadius: 2,
    background: "linear-gradient(135deg, #C6A15B, #9C7638)",
    color: "#FFFDF8",
    fontFamily: "'Manrope', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  submitContent: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  footNote: {
    marginTop: 32,
    fontSize: 10.5,
    letterSpacing: "0.06em",
    color: "rgba(36,30,23,0.4)",
  },
};