import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const reformGrotesk = localFont({
  src: [
    { path: "../../public/fonts/Reform-GroteskRegular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Reform-GroteskSemiExtendedMedium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-reform",
  display: "swap",
});

const monument = localFont({
  src: [
    { path: "../../public/fonts/MonumentRegular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/MonumentMedium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-monument",
  display: "swap",
});

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
    <html lang="en" className={`${reformGrotesk.variable} ${monument.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
