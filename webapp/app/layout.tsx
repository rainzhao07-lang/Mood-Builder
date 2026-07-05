import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mood Builder — Affective Spatial Evolution",
  description:
    "A generative architectural framework that translates emotional states into evolving spaces. Subjective + physiological input → emotion vector → spatial state engine → a temporal 3D record.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
