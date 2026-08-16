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
      ? "دِو‌پِرِپ — آمادگی مصاحبه‌های مهندسی و مرور مفاهیم عمیق"
      : "DevPrep — Engineering Interview & Concept Review",
    description: isFa
      ? "مجموعه سؤالات تخصصی مصاحبه فنی، مفاهیم معماری نرم‌افزار و الگوهای پیشرفته مهندسی."
      : "Curated technical interview questions, deep architectural concepts, and engineering best practices.",
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
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#090A0F",
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
              background:
                "radial-gradient(1200px 400px at 50% 0px, rgba(99, 102, 241, 0.03) 0%, transparent 100%), #090A0F",
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
