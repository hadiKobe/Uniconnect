import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";
import { RouteTracker } from "@/components/RouteTracker/RouteTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LIU Community App",
  description: "Your gateway to the LIU community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <RouteTracker />
          <Toaster richColors position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
