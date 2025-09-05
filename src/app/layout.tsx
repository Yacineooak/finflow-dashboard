import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "FinanceFlow - Personal Finance Dashboard",
    template: "%s | FinanceFlow"
  },
  description: "A modern, interactive personal finance analytics dashboard that helps you take control of your money with beautiful visualizations and intelligent insights.",
  keywords: ["finance", "personal finance", "budgeting", "analytics", "dashboard", "money management", "savings", "investments"],
  authors: [{ name: "FinanceFlow Team" }],
  creator: "FinanceFlow",
  publisher: "FinanceFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://financeflow.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://financeflow.app",
    title: "FinanceFlow - Personal Finance Dashboard",
    description: "Take control of your finances with beautiful visualizations and intelligent insights.",
    siteName: "FinanceFlow",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FinanceFlow Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceFlow - Personal Finance Dashboard",
    description: "Take control of your finances with beautiful visualizations and intelligent insights.",
    images: ["/og-image.jpg"],
    creator: "@financeflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2ed3b7" />
        <meta name="color-scheme" content="dark light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ErrorBoundary 
          isDevelopment={process.env.NODE_ENV === 'development'}
          maxRetries={3}
        >
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
            closeButton
            richColors
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}