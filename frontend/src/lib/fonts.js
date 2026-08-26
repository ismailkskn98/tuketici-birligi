import { Geist, Inter_Tight, Newsreader } from "next/font/google";

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

export const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-editorial-family",
  display: "swap"
});

export const fontVariables = `${interTight.variable} ${geist.variable} ${newsreader.variable}`;
