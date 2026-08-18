"use client";

import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { Stack, Category } from "../../data/models";
import { StackGrid } from "../stacks/StackGrid";
import { useLanguage } from "../../context/LanguageContext";

interface StackItemData {
  stack: Stack;
  stats: {
    questionCount: number;
    conceptCount: number;
    categoryCount: number;
    roadmapCount?: number;
  };
  categories: Category[];
}

interface HomeViewProps {
  stacksData: StackItemData[];
  totalQuestions: number;
  totalConcepts: number;
  totalRoadmaps: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stacksData,
  totalQuestions,
  totalConcepts,
  totalRoadmaps,
}) => {
  const { t, isRtl } = useLanguage();

  return (
    <Box sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        {/* Minimal Hero Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
          {/* Subtle Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.4,
              borderRadius: "100px",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(99, 102, 241, 0.08)"
                  : "rgba(79, 70, 229, 0.08)",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(99, 102, 241, 0.2)"
                  : "rgba(79, 70, 229, 0.2)",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#A5B4FC" : "#4338CA",
              fontSize: "0.75rem",
              fontWeight: 500,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#10B981",
              }}
            />
            {t("homeHeroBadge")}
          </Box>

          {/* Hero Title */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.85rem" },
              letterSpacing: isRtl ? "0" : "-0.03em",
              lineHeight: 1.25,
              mb: 2,
              color: "text.primary",
              maxWidth: 820,
              mx: "auto",
            }}
          >
            {t("homeHeroTitle1")}
            <Box
              component="span"
              sx={{
                color: "primary.main",
              }}
            >
              {t("homeHeroTitle2")}
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "0.9rem", md: "0.975rem" },
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            {t("homeHeroSubtitle")}
          </Typography>

          {/* Minimalist Inline Metric Summary */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 1.5, sm: 2 },
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            <span>
              <Box component="strong" sx={{ color: "text.primary" }}>{stacksData.length}</Box> {isRtl ? "فناوری" : "Stacks"}
            </span>
            <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "divider" }} />
            <span>
              <Box component="strong" sx={{ color: "primary.main" }}>{totalQuestions}</Box> {t("questions")}
            </span>
            <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "divider" }} />
            <span>
              <Box component="strong" sx={{ color: "secondary.main" }}>{totalConcepts}</Box> {t("concepts")}
            </span>
            {totalRoadmaps > 0 && (
              <>
                <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "divider" }} />
                <span>
                  <Box component="strong" sx={{ color: "#F43F5E" }}>{totalRoadmaps}</Box> {t("roadmaps")}
                </span>
              </>
            )}
          </Box>
        </Box>

        {/* Stack Grid */}
        <StackGrid stacksData={stacksData} />
      </Container>
    </Box>
  );
};
