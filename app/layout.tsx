import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";   

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InterviewAI",
  description:
    "Practice technical interviews with AI-powered questions and instant feedback.",
  keywords: [
    "AI Interview",
    "Mock Interview",
    "Interview Practice",
    "Next.js",
    "MERN",
    "Placement Preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}

        <Toaster
    position="top-right"
    richColors
    closeButton
  />

      </body>
    </html>
  );
}