import { Geist, Inter_Tight } from "next/font/google";

export const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-family",
  display: "swap"
});

export const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading-family",
  display: "swap"
});

export const fontVariables = `${interTight.variable} ${geist.variable}`;
