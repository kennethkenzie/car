import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ChatBot } from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Car Baazar | High-End Car Bond",
  description: "Premium car dealership and bond management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <ChatBot />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}