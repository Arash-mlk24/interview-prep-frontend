"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useLanguage } from "../../context/LanguageContext";
import { useThemeMode } from "../../context/ThemeModeContext";
import { TelosLogo } from "../common/TelosLogo";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { mode, toggleColorMode } = useThemeMode();

  const isHome =
    pathname === `/${language}` ||
    pathname === `/${language}/` ||
    pathname === "/" ||
    pathname === "";

  const isDark = mode === "dark";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(9, 10, 15, 0.85)"
            : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: "56px !important",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand Logo & Name */}
          <Box
            component={Link}
            href={`/${language}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "inherit",
              transition: "opacity 0.15s ease",
              "&:hover": { opacity: 0.9 },
            }}
          >
            <TelosLogo size={32} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "text.primary",
                letterSpacing: language === "fa" ? "0" : "-0.02em",
              }}
            >
              {t("appTitle")}
            </Typography>
          </Box>

          {/* Actions: Navigation + Theme Mode + Language Switcher */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isHome && (
              <Button
                component={Link}
                href={`/${language}`}
                size="small"
                startIcon={
                  isRtl ? (
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  "&:hover": {
                    color: "text.primary",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {t("allStacks")}
              </Button>
            )}

            {/* Theme Mode Toggle Button */}
            <Tooltip title={isDark ? (language === "fa" ? "حالت روشن" : "Light Mode") : (language === "fa" ? "حالت تاریک" : "Dark Mode")}>
              <IconButton
                size="small"
                onClick={toggleColorMode}
                aria-label="toggle light or dark theme"
                sx={{
                  color: "text.secondary",
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.08)",
                  p: 0.75,
                  borderRadius: 1.5,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    color: "text.primary",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {isDark ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 17 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 17 }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Language Switcher */}
            <Button
              size="small"
              onClick={toggleLanguage}
              startIcon={<LanguageIcon sx={{ fontSize: 15, color: "text.secondary" }} />}
              sx={{
                color: "text.secondary",
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.03)",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.08)",
                fontSize: "0.78rem",
                fontWeight: 500,
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                "&:hover": {
                  color: "text.primary",
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.06)",
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {t("languageToggle")}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

