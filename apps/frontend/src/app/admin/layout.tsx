import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import { Providers } from "../providers";
import PageHeader from "@/components/admin/page-header";

type Props = { children: ReactNode };

export const metadata: Metadata = {
  title: "Bedis Hairsalon Admin",
};

export default function AdminRootLayout({ children }: Props) {
  return (
    <html lang="de">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body>
        <Providers>
          <main className="flex-1 flex flex-col">
            <Suspense fallback={<div>...Loading</div>}>
              <PageHeader />
              {children}
            </Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}
