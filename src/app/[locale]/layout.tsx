import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import ThemeRegistry from "../../theme/ThemeRegistry";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Box } from "@mui/material";
import { Language } from "../../i18n/translations";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";

  return {
    title: isFa
      ? "تِلوس (Telos) — مرجع جامع ارتقای مهندسی نرم‌افزار و نقشه‌های راه"
      : "Telos — Software Engineering Mastery & Technical Roadmaps",
    description: isFa
      ? "پلتفرم جامع مهندسی نرم‌افزار، نقشه‌های راه تخصصی، مفاهیم عمیق معماری و سوالات مصاحبه سطح پیشرفته."
      : "High-performance software engineering mastery platform: comprehensive technical roadmaps, runtime internals, and curated interview questions.",
    icons: {
      icon: "/images/telos-apex-logo.jpg",
      shortcut: "/images/telos-apex-logo.jpg",
      apple: "/images/telos-apex-logo.jpg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "en" && locale !== "fa") {
    notFound();
  }

  const isRtl = locale === "fa";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={rubik.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Rubik Arabic subset for Persian RTL support */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300..700&subset=arabic&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/images/telos-apex-logo.jpg" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-rubik), sans-serif",
          direction: dir,
        }}
      >
        <ThemeRegistry initialLocale={locale as Language}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "background.default",
              transition: "background-color 0.25s ease, color 0.25s ease",
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
