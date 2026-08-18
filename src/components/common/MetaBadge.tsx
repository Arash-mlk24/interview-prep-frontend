import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type MetaBadgeVariant =
  | "indigo"
  | "sky"
  | "emerald"
  | "amber"
  | "rose"
  | "purple"
  | "neutral";

export interface MetaBadgeProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  variant?: MetaBadgeVariant;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
}

const getVariantStyles = (variant: MetaBadgeVariant, isDark: boolean) => {
  if (!isDark) {
    switch (variant) {
      case "indigo":
        return { bg: "rgba(79, 70, 229, 0.08)", border: "rgba(79, 70, 229, 0.2)", color: "#4338CA", iconColor: "#4F46E5" };
      case "sky":
        return { bg: "rgba(2, 132, 199, 0.08)", border: "rgba(2, 132, 199, 0.2)", color: "#0369A1", iconColor: "#0284C7" };
      case "emerald":
        return { bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.25)", color: "#047857", iconColor: "#059669" };
      case "amber":
        return { bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.25)", color: "#B45309", iconColor: "#D97706" };
      case "rose":
        return { bg: "rgba(244, 63, 94, 0.08)", border: "rgba(244, 63, 94, 0.22)", color: "#BE123C", iconColor: "#E11D48" };
      case "purple":
        return { bg: "rgba(168, 85, 247, 0.08)", border: "rgba(168, 85, 247, 0.22)", color: "#7E22CE", iconColor: "#9333EA" };
      case "neutral":
      default:
        return { bg: "rgba(0, 0, 0, 0.04)", border: "rgba(0, 0, 0, 0.08)", color: "#475569", iconColor: "#64748B" };
    }
  }

  switch (variant) {
    case "indigo":
      return { bg: "rgba(99, 102, 241, 0.12)", border: "rgba(99, 102, 241, 0.28)", color: "#A5B4FC", iconColor: "#818CF8" };
    case "sky":
      return { bg: "rgba(56, 189, 248, 0.1)", border: "rgba(56, 189, 248, 0.26)", color: "#7DD3FC", iconColor: "#38BDF8" };
    case "emerald":
      return { bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.3)", color: "#34D399", iconColor: "#10B981" };
    case "amber":
      return { bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.3)", color: "#FBBF24", iconColor: "#F59E0B" };
    case "rose":
      return { bg: "rgba(244, 63, 94, 0.12)", border: "rgba(244, 63, 94, 0.28)", color: "#FDA4AF", iconColor: "#F43F5E" };
    case "purple":
      return { bg: "rgba(168, 85, 247, 0.12)", border: "rgba(168, 85, 247, 0.28)", color: "#D8B4FE", iconColor: "#C084FC" };
    case "neutral":
    default:
      return { bg: "rgba(255, 255, 255, 0.04)", border: "rgba(255, 255, 255, 0.09)", color: "#CBD5E1", iconColor: "#94A3B8" };
  }
};

export const MetaBadge: React.FC<MetaBadgeProps> = ({
  icon,
  label,
  variant = "neutral",
  size = "small",
  sx,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const currentVariant = getVariantStyles(variant, isDark);
  const isSmall = size === "small";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? 0.75 : 1,
        px: isSmall ? 1.25 : 1.6,
        py: isSmall ? 0.45 : 0.65,
        borderRadius: 2,
        backgroundColor: currentVariant.bg,
        border: "1px solid",
        borderColor: currentVariant.border,
        color: currentVariant.color,
        fontSize: isSmall ? "0.74rem" : "0.82rem",
        fontWeight: 600,
        lineHeight: 1.2,
        userSelect: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
        boxSizing: "border-box",
        transition: "all 0.2s ease",
        ...sx,
      }}
    >
      {icon && (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: currentVariant.iconColor || "inherit",
            flexShrink: 0,
            lineHeight: 0,
            "& svg": {
              fontSize: isSmall ? "14px !important" : "16px !important",
              display: "block",
            },
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        component="span"
        sx={{
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit",
          lineHeight: "inherit",
          letterSpacing: "inherit",
          display: "inline-block",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

