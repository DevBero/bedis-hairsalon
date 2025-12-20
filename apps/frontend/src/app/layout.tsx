import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bedis Hairsalon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <main className="flex-1 flex">{children}</main>
      </body>
    </html>
  );
}
