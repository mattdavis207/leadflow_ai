import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leadflow AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <nav className="border-b border-zinc-200 bg-white">
          <ul className="flex max-w-5xl items-center gap-2 px-6 py-3">
            <li>
              <Link
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                href="/import"
              >
                Import CSV
              </Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
