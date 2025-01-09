import type { Metadata } from "next";
import "./globals.css";

import DarkMode from "./components/DarkMode";

export const metadata: Metadata = {
  title: "Weather Station Project",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark:bg-gray-900 antialiased`}>
        <DarkMode />
        {children}
      </body>
    </html>
  );
}
