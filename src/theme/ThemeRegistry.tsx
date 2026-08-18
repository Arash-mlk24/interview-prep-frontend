"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { getAppTheme } from "./theme";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { RoadmapProgressProvider } from "../context/RoadmapProgressContext";
import { ThemeModeProvider, useThemeMode } from "../context/ThemeModeContext";
import { Language } from "../i18n/translations";

function ThemeRegistryInner({ children }: { children: React.ReactNode }) {
  const { direction, isRtl } = useLanguage();
  const { mode } = useThemeMode();
  const currentTheme = React.useMemo(() => getAppTheme(direction, mode), [direction, mode]);

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
      <ThemeModeProvider>
        <RoadmapProgressProvider>
          <ThemeRegistryInner>{children}</ThemeRegistryInner>
        </RoadmapProgressProvider>
      </ThemeModeProvider>
    </LanguageProvider>
  );
}

