"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { getAppTheme } from "./theme";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { Language } from "../i18n/translations";

function ThemeRegistryInner({ children }: { children: React.ReactNode }) {
  const { direction, isRtl } = useLanguage();
  const currentTheme = React.useMemo(() => getAppTheme(direction), [direction]);

  return (
    <AppRouterCacheProvider
      key={isRtl ? "rtl" : "ltr"}
      options={{
        key: isRtl ? "muirtl" : "mui",
        stylisPlugins: isRtl ? [prefixer, rtlPlugin] : [prefixer],
      }}
    >
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default function ThemeRegistry({
  initialLocale,
  children,
}: {
  initialLocale: Language;
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      <ThemeRegistryInner>{children}</ThemeRegistryInner>
    </LanguageProvider>
  );
}
