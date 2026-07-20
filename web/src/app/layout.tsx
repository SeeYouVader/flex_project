import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "flex_project",
  description: "Sample ATS for full-cycle candidate tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
