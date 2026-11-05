import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ibmPlexMono, ibmPlexSans } from "./fonts";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Context.dev Bot",
  description: "Autonomous customer discovery and outreach.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
