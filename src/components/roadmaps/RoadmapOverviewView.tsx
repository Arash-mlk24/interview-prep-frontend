"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  LinearProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import HomeIcon from "@mui/icons-material/Home";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Stack, Roadmap } from "../../data/models";
import { useLanguage } from "../../context/LanguageContext";
import { useRoadmapProgress } from "../../context/RoadmapProgressContext";
import { RoadmapStepCard } from "./RoadmapStepCard";
import { SearchInput } from "../common/SearchInput";
import { MetaBadge } from "../common/MetaBadge";
import { roadmapRepository } from "../../repositories/roadmapRepository";

interface RoadmapOverviewViewProps {
  stack: Stack;
  roadmap: Roadmap;
}

export const RoadmapOverviewView: React.FC<RoadmapOverviewViewProps> = ({
  stack,
  roadmap,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { language, t, getLocalized, isRtl } = useLanguage();
  const { getRoadmapProgress } = useRoadmapProgress();

  // Exclusive single open step (default opens first step or null)
  const [expandedStepId, setExpandedStepId] = useState<string | null>(() => {
    return roadmap.steps[0]?.id || null;
  });

  const localizedStackName = getLocalized(stack.name, stack.name_fa);
  const localizedRoadmapTitle = getLocalized(roadmap.title, roadmap.title_fa);
  const localizedRoadmapDesc = getLocalized(roadmap.description, roadmap.description_fa);
  const localizedLevel = getLocalized(roadmap.targetLevel, roadmap.targetLevel_fa);

  const allTopicIds = useMemo(
    () => roadmap.steps.flatMap((s) => s.topics.map((t) => t.id)),
    [roadmap]
  );

  const progress = getRoadmapProgress(allTopicIds);

  const totalTopics = roadmap.steps.reduce((acc, s) => acc + s.topics.length, 0);
  const totalQuestions = roadmap.steps.reduce(
    (acc, s) =>
      acc +
      s.topics.reduce(
        (tAcc, topic) => tAcc + roadmapRepository.getQuestionCountForTopic(topic.id),
        0
      ),
    0
  );

  const filteredSteps = useMemo(() => {
    if (!searchTerm.trim()) return roadmap.steps;
    const term = searchTerm.toLowerCase();

    return roadmap.steps
      .map((step) => {
        const stepTitleMatch =
          step.title.toLowerCase().includes(term) ||
          (step.title_fa || "").toLowerCase().includes(term);

        const matchingTopics = step.topics.filter((topic) => {
          const titleEn = topic.title.toLowerCase();
          const titleFa = (topic.title_fa || "").toLowerCase();
          const sumEn = topic.summary.toLowerCase();
          const sumFa = (topic.summary_fa || "").toLowerCase();

          return (
            titleEn.includes(term) ||
            titleFa.includes(term) ||
            sumEn.includes(term) ||
            sumFa.includes(term)
          );
        });

        if (stepTitleMatch || matchingTopics.length > 0) {
          return {
            ...step,
            topics: stepTitleMatch ? step.topics : matchingTopics,
          };
        }
        return null;
      })
      .filter((s): s is typeof roadmap.steps[0] => s !== null);
  }, [roadmap.steps, searchTerm]);

  const handleToggleStep = (stepId: string) => {
    setExpandedStepId((current) => (current === stepId ? null : stepId));
  };

  return (
    <Box sx={{ py: { xs: 3.5, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            isRtl ? (
              <NavigateBeforeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
            ) : (
              <NavigateNextIcon sx={{ fontSize: 14, color: "text.disabled" }} />
            )
          }
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <MuiLink
            component={Link}
            href={`/${language}`}
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              gap: 0.5,
              fontSize: "0.82rem",
              "&:hover": { color: "text.primary" },
            }}
          >
            <HomeIcon sx={{ fontSize: 15 }} />
            {t("allStacks")}
          </MuiLink>

          <MuiLink
            component={Link}
            href={`/${language}/stack/${stack.slug}`}
            underline="hover"
            sx={{
              color: "text.secondary",
              fontSize: "0.82rem",
              "&:hover": { color: "text.primary" },
            }}
          >
            {localizedStackName}
          </MuiLink>

          <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "0.82rem" }}>
            {localizedRoadmapTitle}
          </Typography>
        </Breadcrumbs>

        {/* Header Hero Banner */}
        <Box
          sx={{
            p: { xs: 3.5, md: 4.5 },
            mb: 4.5,
            borderRadius: 3.5,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            position: "relative",
            overflow: "hidden",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px -2px rgba(0, 0, 0, 0.4)"
                : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Subtle Ambient Glow */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              right: isRtl ? "auto" : -60,
              left: isRtl ? -60 : "auto",
              width: 250,
              height: 250,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.03) 70%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 3.5,
            }}
          >
            <Box sx={{ maxWidth: 740 }}>
              {/* Redesigned Metadata Pills with Zero Overflow */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <MetaBadge
                  icon={<AltRouteIcon />}
                  label={localizedLevel}
                  variant="indigo"
                />
                {progress.completed > 0 && (
                  <MetaBadge
                    icon={<CheckCircleIcon />}
                    label={t("roadmapProgress", { percentage: progress.percentage })}
                    variant="emerald"
                  />
                )}
              </Box>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  fontSize: { xs: "1.25rem", md: "1.6rem" },
                  mb: 1.5,
                  lineHeight: 1.35,
                }}
              >
                {localizedRoadmapTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.86rem",
                  lineHeight: 1.75,
                  mb: 3,
                }}
              >
                {localizedRoadmapDesc}
              </Typography>

              {/* Interactive Progress Bar */}
              <Box sx={{ maxWidth: 520 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.72rem", fontWeight: 500 }}
                  >
                    {t("progress")}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: progress.completed > 0 ? "#10B981" : "text.secondary",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    {progress.completed} / {progress.total} {t("topics")} ({progress.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress.percentage}
                  sx={{
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3.5,
                      background:
                        progress.percentage === 100
                          ? "linear-gradient(90deg, #10B981 0%, #34D399 100%)"
                          : "linear-gradient(90deg, #6366F1 0%, #38BDF8 100%)",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Quick Metrics */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                gap: 2,
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", fontSize: "0.68rem", mb: 0.25 }}
                >
                  {t("steps")}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "primary.main", fontSize: "1.05rem" }}>
                  {roadmap.steps.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", fontSize: "0.68rem", mb: 0.25 }}
                >
                  {t("topics")}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "secondary.main", fontSize: "1.05rem" }}>
                  {totalTopics}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", fontSize: "0.68rem", mb: 0.25 }}
                >
                  {t("questions")}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#F43F5E", fontSize: "1.05rem" }}>
                  {totalQuestions}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Filter Search Input */}
        <Box sx={{ mb: 4 }}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("searchTopicsPlaceholder")}
            variant="default"
            maxWidth={480}
            showShortcut={false}
          />
        </Box>

        {/* Collapsible Steps List (Exclusive Single-Step Accordion) */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {filteredSteps.map((step, idx) => (
            <RoadmapStepCard
              key={step.id}
              step={step}
              stepIndex={idx}
              stackSlug={stack.slug}
              roadmapSlug={roadmap.slug}
              isExpanded={expandedStepId === step.id}
              onToggle={() => handleToggleStep(step.id)}
            />
          ))}

          {filteredSteps.length === 0 && (
            <Box
              sx={{
                py: 7,
                textAlign: "center",
                backgroundColor: "background.paper",
                borderRadius: 3.5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                {t("noQuestionsFound")}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Back Button */}
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Button
            component={Link}
            href={`/${language}/stack/${stack.slug}`}
            variant="outlined"
            startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              borderRadius: 2.5,
              px: 3.5,
              py: 1.25,
              "&:hover": {
                borderColor: "primary.main",
                color: "text.primary",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(99, 102, 241, 0.08)"
                    : "rgba(79, 70, 229, 0.04)",
              },
            }}
          >
            {language === "fa" ? `بازگشت به ${localizedStackName}` : `Back to ${localizedStackName}`}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
