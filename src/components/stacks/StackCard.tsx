"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TerminalIcon from "@mui/icons-material/Terminal";
import WebIcon from "@mui/icons-material/Web";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import { Stack, Category } from "../../data/models";
import { useLanguage } from "../../context/LanguageContext";

interface StackCardProps {
  stack: Stack;
  stats: {
    questionCount: number;
    conceptCount: number;
    categoryCount: number;
  };
  categories: Category[];
}

function getStackIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "dotnet":
      return <IntegrationInstructionsIcon sx={{ fontSize: 20, color: "#818CF8" }} />;
    case "react":
      return <WebIcon sx={{ fontSize: 20, color: "#38BDF8" }} />;
    case "typescript":
      return <TerminalIcon sx={{ fontSize: 20, color: "#60A5FA" }} />;
    default:
      return <TerminalIcon sx={{ fontSize: 20, color: "#818CF8" }} />;
  }
}

export const StackCard: React.FC<StackCardProps> = ({ stack, stats, categories }) => {
  const { language, t, getLocalized, isRtl } = useLanguage();

  const localizedName = getLocalized(stack.name, stack.name_fa);
  const localizedDesc = getLocalized(stack.description, stack.description_fa);

  return (
    <Box
      component={Link}
      href={`/${language}/stack/${stack.slug}`}
      sx={{
        display: "block",
        textDecoration: "none",
        height: "100%",
      }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0F121C",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 3,
          p: 2.5,
          transition: "all 0.18s ease-in-out",
          position: "relative",
          "&:hover": {
            borderColor: "rgba(99, 102, 241, 0.35)",
            backgroundColor: "#131724",
            transform: "translateY(-2px)",
            "& .stack-arrow": {
              transform: isRtl ? "translateX(-3px)" : "translateX(3px)",
              color: "#818CF8",
            },
          },
        }}
      >
        <CardContent sx={{ p: "0 !important", display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {/* Header: Icon + Title + Count */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getStackIcon(stack.icon)}
              </Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 600, color: "#F8FAFC", fontSize: "1.05rem" }}
              >
                {localizedName}
              </Typography>
            </Box>

            <Chip
              label={`${stats.questionCount} ${t("questions")}`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 500,
                backgroundColor: "rgba(99, 102, 241, 0.08)",
                color: "#A5B4FC",
                border: "1px solid rgba(99, 102, 241, 0.18)",
              }}
            />
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              fontSize: "0.825rem",
              lineHeight: 1.6,
              mb: 2,
              flexGrow: 1,
            }}
          >
            {localizedDesc}
          </Typography>

          {/* Categories Chips */}
          {categories.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 2 }}>
              {categories.slice(0, 3).map((cat) => (
                <Box
                  key={cat.id}
                  sx={{
                    fontSize: "0.7rem",
                    px: 0.9,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    color: "#64748B",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {getLocalized(cat.name, cat.name_fa)}
                </Box>
              ))}
              {categories.length > 3 && (
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    px: 0.7,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    color: "#475569",
                  }}
                >
                  +{categories.length - 3}
                </Box>
              )}
            </Box>
          )}

          {/* Footer: Metrics Summary & Arrow Link */}
          <Box
            sx={{
              pt: 1.5,
              borderTop: "1px solid rgba(255, 255, 255, 0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
              {stats.conceptCount} {t("concepts")} · {stats.categoryCount} {t("categories")}
            </Typography>

            <Box
              className="stack-arrow"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#64748B",
                fontSize: "0.75rem",
                fontWeight: 500,
                transition: "all 0.15s ease",
              }}
            >
              <span>{isRtl ? "مشاهده" : "Explore"}</span>
              {isRtl ? (
                <ArrowBackIcon sx={{ fontSize: 13 }} />
              ) : (
                <ArrowForwardIcon sx={{ fontSize: 13 }} />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
