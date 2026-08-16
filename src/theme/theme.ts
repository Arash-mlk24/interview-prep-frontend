"use client";

import { createTheme, Direction } from "@mui/material/styles";

// Rubik supports both Latin & Arabic (Persian) scripts
const RUBIK = ["var(--font-rubik)", "Rubik", "Tahoma", "Arial", "sans-serif"].join(",");

export function getAppTheme(direction: Direction = "ltr") {
  const isRtl = direction === "rtl";

  return createTheme({
    direction,
    palette: {
      mode: "dark",
      primary: {
        main: "#6366F1", // Indigo
        light: "#818CF8",
        dark: "#4F46E5",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#38BDF8", // Sky blue
        light: "#7DD3FC",
        dark: "#0284C7",
        contrastText: "#FFFFFF",
      },
      background: {
        default: "#090A0F", // Deep obsidian
        paper: "#0F121C",   // Refined surface
      },
      text: {
        primary: "#F8FAFC",
        secondary: "#94A3B8",
        disabled: "#475569",
      },
      divider: "rgba(255, 255, 255, 0.06)",
      success: {
        main: "#10B981",
        light: "#34D399",
        dark: "#059669",
      },
      warning: {
        main: "#F59E0B",
        light: "#FBBF24",
        dark: "#D97706",
      },
      info: {
        main: "#6366F1",
        light: "#818CF8",
        dark: "#4F46E5",
      },
      error: {
        main: "#EF4444",
        light: "#F87171",
        dark: "#DC2626",
      },
    },
    typography: {
      fontFamily: RUBIK,
      fontSize: 14.5,
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
        letterSpacing: isRtl ? "0" : "-0.025em",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.25,
        letterSpacing: isRtl ? "0" : "-0.02em",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.3,
        letterSpacing: isRtl ? "0" : "-0.015em",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.35,
        letterSpacing: isRtl ? "0" : "-0.01em",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.1rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: "0.95rem",
        lineHeight: 1.45,
      },
      subtitle1: {
        fontSize: "1rem",
        lineHeight: 1.65,
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "0.925rem",
        lineHeight: 1.7,
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.825rem",
        lineHeight: 1.6,
        color: "#94A3B8",
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: 1.4,
        letterSpacing: "0.01em",
      },
      overline: {
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
      button: {
        fontSize: "0.85rem",
        fontWeight: 500,
        textTransform: "none",
        letterSpacing: isRtl ? "0" : "0.01em",
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: RUBIK,
            backgroundColor: "#090A0F",
            color: "#F8FAFC",
            direction,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "#0F121C",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 12,
            transition: "border-color 0.2s ease, transform 0.2s ease",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.12)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "rgba(15, 18, 28, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "10px !important",
            marginBottom: "8px",
            transition: "border-color 0.15s ease, background-color 0.15s ease",
            "&:before": {
              display: "none",
            },
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.12)",
              backgroundColor: "rgba(18, 22, 34, 0.8)",
            },
            "&.Mui-expanded": {
              borderColor: "rgba(99, 102, 241, 0.3)",
              backgroundColor: "rgba(18, 22, 36, 0.9)",
              marginBottom: "8px",
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: "8px 16px",
            minHeight: "48px",
            "&.Mui-expanded": {
              minHeight: "48px",
            },
            "& .MuiAccordionSummary-expandIconWrapper": {
              color: "#64748B",
              transition: "transform 0.2s ease, color 0.15s ease",
              "&.Mui-expanded": {
                color: "#818CF8",
              },
            },
          },
          content: {
            margin: "4px 0",
            marginInlineEnd: "12px",
            "&.Mui-expanded": {
              margin: "4px 0",
              marginInlineEnd: "12px",
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: "14px 16px 20px 16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.04)",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
            fontSize: "0.85rem",
            padding: "6px 14px",
            fontFamily: RUBIK,
            transition: "all 0.15s ease",
            "&.MuiButton-containedPrimary": {
              backgroundColor: "#6366F1",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#4F46E5",
              },
            },
            "&.MuiButton-outlined": {
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#94A3B8",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.16)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                color: "#F8FAFC",
              },
            },
          },
          startIcon: {
            marginRight: "6px",
            marginLeft: "-2px",
          },
          endIcon: {
            marginLeft: "6px",
            marginRight: "-2px",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: RUBIK,
            fontWeight: 500,
            borderRadius: 6,
            fontSize: "0.72rem",
            height: "22px",
          },
          icon: {
            marginRight: "4px",
            marginLeft: "-4px",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 2,
            backgroundColor: "#6366F1",
          },
          root: {
            minHeight: "44px",
            "& .MuiTabs-flexContainer": {
              gap: "4px",
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            fontFamily: RUBIK,
            color: "#64748B",
            minHeight: "44px",
            padding: "8px 16px",
            transition: "color 0.15s ease",
            "&:hover": {
              color: "#94A3B8",
            },
            "&.Mui-selected": {
              color: "#F8FAFC",
              fontWeight: 600,
            },
            "& .MuiTab-iconWrapper": {
              marginRight: "6px",
              marginLeft: "0",
              marginBottom: "0 !important",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              fontFamily: RUBIK,
              fontSize: "0.875rem",
              backgroundColor: "rgba(15, 18, 28, 0.6)",
              borderRadius: 8,
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.08)",
                transition: "border-color 0.15s ease",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.16)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366F1",
                borderWidth: "1px",
              },
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(15, 18, 28, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 8,
            padding: 2,
            gap: 2,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontFamily: RUBIK,
            fontSize: "0.8rem",
            border: "none !important",
            borderRadius: "6px !important",
            color: "#64748B",
            padding: "4px 10px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              color: "#94A3B8",
            },
            "&.Mui-selected": {
              color: "#F8FAFC",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
        },
      },
    },
  });
}

export const theme = getAppTheme("ltr");
