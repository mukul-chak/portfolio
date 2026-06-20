import type { Metadata } from "next";
import "./globals.css";
import Toaster from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "Mukul Chakravarthi",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
