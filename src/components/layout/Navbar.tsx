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
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../../context/LanguageContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t, isRtl } = useLanguage();

  const isHome =
    pathname === `/${language}` ||
    pathname === `/${language}/` ||
    pathname === "/" ||
    pathname === "";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(9, 10, 15, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "7px",
                backgroundColor: "#6366F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CodeIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "#F8FAFC",
                letterSpacing: language === "fa" ? "0" : "-0.02em",
              }}
            >
              {t("appTitle")}
            </Typography>
          </Box>

          {/* Actions: Navigation + Language Switcher */}
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
                  color: "#94A3B8",
                  fontSize: "0.8rem",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  "&:hover": {
                    color: "#F8FAFC",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                  },
                }}
              >
                {t("allStacks")}
              </Button>
            )}

            {/* Minimal Language Switcher */}
            <Button
              size="small"
              onClick={toggleLanguage}
              startIcon={<LanguageIcon sx={{ fontSize: 15, color: "#94A3B8" }} />}
              sx={{
                color: "#94A3B8",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.78rem",
                fontWeight: 500,
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                "&:hover": {
                  color: "#F8FAFC",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
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
