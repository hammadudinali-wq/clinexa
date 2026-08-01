import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clinexa",
    template: "%s | Clinexa",
  },
  description:
    "Clinexa is a professional hospital management system for administrators, doctors, and patients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}