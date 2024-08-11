import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "/Users/mohammednabil/Desktop/ai-customer-support/components/SessionWrapper.tsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Brakes Plus Chat",
  description: "AI Chatbot to help customers with their questions ",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SessionWrapper>
  );
}
