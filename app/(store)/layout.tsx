import type { Metadata } from "next";
import "../globals.css";
import WebMCP from "@/components/webmcp";
export const metadata: Metadata = {
  title: { default: "HypoX — your vive. your x", template: "%s | HypoX" },
  description:
    "HypoX clothing. Oversized tees, heavyweight hoodies, cargos and everyday layers. your vive. your x",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <WebMCP />
      </body>
    </html>
  );
}
