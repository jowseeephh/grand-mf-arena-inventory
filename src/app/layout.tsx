import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Grand MF Arena", description: "Inventory, Ordering, Sales & Remittance System" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
