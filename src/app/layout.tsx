import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Archive of Human Knowledge",
  description: "An interactive 3D universe representing human disciplines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-space text-white">
        {children}
      </body>
    </html>
  );
}
