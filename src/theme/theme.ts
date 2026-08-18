"use client";

import { createTheme, Direction } from "@mui/material/styles";

// Rubik supports both Latin & Arabic (Persian) scripts
const RUBIK = ["var(--font-rubik)", "Rubik", "Tahoma", "Arial", "sans-serif"].join(",");

export function getAppTheme(direction: Direction = "ltr", mode: "dark" | "light" = "dark") {
  const isRtl = direction === "rtl";
  const isDark = mode === "dark";

  return createTheme({
    direction,
    palette: {
      mode,
      primary: {
        main: isDark ? "#6366F1" : "#4F46E5", // Indigo
        light: isDark ? "#818CF8" : "#6366F1",
        dark: isDark ? "#4F46E5" : "#3730A3",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: isDark ? "#38BDF8" : "#0284C7", // Sky blue
        light: isDark ? "#7DD3FC" : "#38BDF8",
        dark: isDark ? "#0284C7" : "#0369A1",
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDark ? "#090A0F" : "#F8FAFC", // Deep obsidian vs Clean Slate 50
        paper: isDark ? "#0F121C" : "#FFFFFF",   // Refined surface vs Pure White
      },
      text: {
        primary: isDark ? "#F8FAFC" : "#0F172A",
        secondary: isDark ? "#94A3B8" : "#475569",
        disabled: isDark ? "#475569" : "#94A3B8",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
      success: {
        main: isDark ? "#10B981" : "#059669",
        light: "#34D399",
        dark: "#047857",
      },
      warning: {
        main: "#F59E0B",
        light: "#FBBF24",
        dark: "#D97706",
      },
      info: {
        main: isDark ? "#6366F1" : "#4F46E5",
        light: "#818CF8",
        dark: "#3730A3",
      },
      error: {
        main: "#EF4444",
        light: "#F87171",
        dark: "#DC2626",
      },
    },
    typography: {
      fontFamily: RUBIK,
      fontSize: 13.5,
      h1: {
        fontWeight: 700,
        fontSize: "2.15rem",
        lineHeight: 1.2,
        letterSpacing: isRtl ? "0" : "-0.025em",
      },
      h2: {
        fontWeight: 700,
        fontSize: "1.75rem",
        lineHeight: 1.25,
        letterSpacing: isRtl ? "0" : "-0.02em",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.3rem",
        lineHeight: 1.3,
        letterSpacing: isRtl ? "0" : "-0.015em",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.1rem",
        lineHeight: 1.35,
        letterSpacing: isRtl ? "0" : "-0.01em",
      },
      h5: {
        fontWeight: 600,
        fontSize: "0.98rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: "0.875rem",
        lineHeight: 1.45,
      },
      subtitle1: {
        fontSize: "0.9rem",
        lineHeight: 1.65,
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: "0.8rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "0.84rem",
        lineHeight: 1.7,
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.75rem",
        lineHeight: 1.6,
        color: isDark ? "#94A3B8" : "#475569",
      },
      caption: {
        fontSize: "0.7rem",
        lineHeight: 1.4,
        letterSpacing: "0.01em",
      },
      overline: {
        fontSize: "0.62rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
      button: {
        fontSize: "0.78rem",
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
            backgroundColor: isDark ? "#090A0F" : "#F8FAFC",
            color: isDark ? "#F8FAFC" : "#0F172A",
            direction,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isDark ? "#0F121C" : "#FFFFFF",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 12,
            boxShadow: isDark ? "none" : "0 2px 10px -2px rgba(0, 0, 0, 0.04)",
            transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
            "&:hover": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.16)",
              boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.08)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isDark ? "#0F121C" : "#FFFFFF",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isDark ? "rgba(15, 18, 28, 0.6)" : "#FFFFFF",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "10px !important",
            marginBottom: "8px",
            boxShadow: isDark ? "none" : "0 1px 4px rgba(0, 0, 0, 0.03)",
            transition: "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
            "&:before": {
              display: "none",
            },
            "&:hover": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.15)",
              backgroundColor: isDark ? "rgba(18, 22, 34, 0.8)" : "#FAFAFE",
            },
            "&.Mui-expanded": {
              borderColor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.35)",
              backgroundColor: isDark ? "rgba(18, 22, 36, 0.9)" : "#F5F3FF",
              marginBottom: "8px",
              boxShadow: isDark ? "none" : "0 4px 14px rgba(79, 70, 229, 0.06)",
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
              color: isDark ? "#64748B" : "#64748B",
              transition: "transform 0.2s ease, color 0.15s ease",
              "&.Mui-expanded": {
                color: isDark ? "#818CF8" : "#4F46E5",
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
            borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(0, 0, 0, 0.05)",
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
            fontSize: "0.78rem",
            padding: "6px 14px",
            fontFamily: RUBIK,
            transition: "all 0.15s ease",
            "&.MuiButton-containedPrimary": {
              backgroundColor: isDark ? "#6366F1" : "#4F46E5",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: isDark ? "#4F46E5" : "#4338CA",
              },
            },
            "&.MuiButton-outlined": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.12)",
              color: isDark ? "#94A3B8" : "#475569",
              "&:hover": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.22)",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                color: isDark ? "#F8FAFC" : "#0F172A",
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
            fontSize: "0.66rem",
            height: "22px",
          },
          icon: {
            marginRight: "4px",
            marginLeft: "-4px",
          },
        },
      },
      MuiTabs: {
        defaultProps: {
          variant: "scrollable",
          scrollButtons: "auto",
          allowScrollButtonsMobile: true,
        },
        styleOverrides: {
          indicator: {
            height: 2,
            backgroundColor: isDark ? "#6366F1" : "#4F46E5",
          },
          root: {
            minHeight: "44px",
            "& .MuiTabs-flexContainer": {
              gap: "4px",
            },
            "& .MuiTabs-scroller": {
              overflowX: "auto !important",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            },
            "& .MuiTabs-scrollButtons": {
              color: isDark ? "#94A3B8" : "#64748B",
              width: "28px",
              "&.Mui-disabled": {
                opacity: 0.2,
              },
              "&:hover": {
                color: isDark ? "#FFFFFF" : "#0F172A",
              },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontFamily: RUBIK,
            color: isDark ? "#64748B" : "#64748B",
            minHeight: "44px",
            minWidth: "auto",
            padding: "8px 16px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "color 0.15s ease",
            "&:hover": {
              color: isDark ? "#94A3B8" : "#334155",
            },
            "&.Mui-selected": {
              color: isDark ? "#F8FAFC" : "#0F172A",
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
              fontSize: "0.8rem",
              backgroundColor: isDark ? "rgba(15, 18, 28, 0.6)" : "#FFFFFF",
              borderRadius: 8,
              "& fieldset": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.12)",
                transition: "border-color 0.15s ease",
              },
              "&:hover fieldset": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.22)",
              },
              "&.Mui-focused fieldset": {
                borderColor: isDark ? "#6366F1" : "#4F46E5",
                borderWidth: "1px",
              },
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "rgba(15, 18, 28, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.08)",
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
            fontSize: "0.74rem",
            border: "none !important",
            borderRadius: "6px !important",
            color: isDark ? "#64748B" : "#64748B",
            padding: "4px 10px",
            "&:hover": {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
              color: isDark ? "#94A3B8" : "#334155",
            },
            "&.Mui-selected": {
              color: isDark ? "#F8FAFC" : "#0F172A",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF",
              boxShadow: isDark ? "none" : "0 1px 3px rgba(0, 0, 0, 0.08)",
              "&:hover": {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#FFFFFF",
              },
            },
          },
        },
      },
    },
  });
}

export const theme = getAppTheme("ltr", "dark");
