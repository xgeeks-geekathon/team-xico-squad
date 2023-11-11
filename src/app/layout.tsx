import { Providers } from "@/components/provider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "xgeeks AI",
  description: "Example use cases to get you started.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}> <Providers>{children}</Providers></body>
    </html>
  );
}
