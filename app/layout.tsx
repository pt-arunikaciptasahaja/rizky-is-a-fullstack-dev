import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/ibm-plex-sans";
import "./globals.css";

const themeBootScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("portfolio-theme");
      const theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export const metadata: Metadata = {
  title: "Muhammad Rizky Syadrie | Full-Stack & Cloud Software Engineer",
  description:
    "Full-stack and cloud software engineer with 6+ years building enterprise React, Next.js, Node.js, and Google Cloud platforms.",
  keywords: [
    "Software Engineer",
    "Full-Stack Engineer",
    "Cloud Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Google Cloud",
    "Jakarta",
  ],
  openGraph: {
    title: "Muhammad Rizky Syadrie | Full-Stack & Cloud Software Engineer",
    description:
      "Enterprise web engineering, cloud modernization, and measurable platform impact.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
