import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import Header from '../components/Header'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoldenMemorial - ციფრული მემორიალების პლატფორმა",
  description: "გოლდენ მემორიალი - შექმენით ციფრული მემორიალი თქვენი ახლობლისთვის. ფოტოები, მოგონებები და ხსოვნა ერთ პლატფორმაზე.",
  keywords: [
    "ციფრული მემორიალი",
    "მემორიალი",
    "ხსოვნა",
    "გოლდენ მემორიალი",
    "goldenmemorial",
    "digital memorial georgia",
    "მემორიალური გვერდი",
  ],
  alternates: {
    canonical: "https://goldenmemorial.ge",
  },
  openGraph: {
    title: "გოლდენ მემორიალი - ციფრული მემორიალების პლატფორმა",
    description: "შექმენით ციფრული მემორიალი თქვენი ახლობლისთვის.",
    url: "https://goldenmemorial.ge",
    locale: "ka_GE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col">
        <main>
          <ClerkProvider>
             <ConvexClientProvider >
              <Header />
        {children}
        </ConvexClientProvider>
        </ClerkProvider>
        </main>
        
        
        </body>
    </html>
  );
}
