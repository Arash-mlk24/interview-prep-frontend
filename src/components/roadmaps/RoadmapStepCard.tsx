"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  Typography,
  Collapse,
  IconButton,
  Theme,
} from "@mui/material";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RoadmapStep } from "../../data/models";
import { useLanguage } from "../../context/LanguageContext";
import { useRoadmapProgress } from "../../context/RoadmapProgressContext";
import { roadmapRepository } from "../../repositories/roadmapRepository";
import { MetaBadge } from "../common/MetaBadge";

interface RoadmapStepCardProps {
  step: RoadmapStep;
  stepIndex: number;
  stackSlug: string;
  roadmapSlug: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const RoadmapStepCard: React.FC<RoadmapStepCardProps> = ({
  step,
  stepIndex,
  stackSlug,
  roadmapSlug,
  isExpanded: controlledExpanded,
  onToggle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const { language, t, getLocalized, isRtl } = useLanguage();
  const { isTopicCompleted } = useRoadmapProgress();

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const localizedStepTitle = getLocalized(step.title, step.title_fa);
  const localizedStepDesc = getLocalized(step.description, step.description_fa);

  const completedCount = step.topics.filter((t) => isTopicCompleted(t.id)).length;
  const isStepComplete = step.topics.length > 0 && completedCount === step.topics.length;

  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: isStepComplete
          ? "rgba(16, 185, 129, 0.4)"
          : isExpanded
          ? "primary.main"
          : "divider",
        borderRadius: 3,
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isExpanded
          ? (theme: Theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px -2px rgba(99, 102, 241, 0.12)"
                : "0 4px 20px -2px rgba(79, 70, 229, 0.08)"
          : (theme: Theme) =>
              theme.palette.mode === "dark"
                ? "none"
                : "0 2px 8px -2px rgba(0, 0, 0, 0.04)",
        "&:hover": {
          borderColor: isStepComplete
            ? "rgba(16, 185, 129, 0.6)"
            : "primary.main",
          boxShadow: (theme: Theme) =>
            theme.palette.mode === "dark"
              ? "0 6px 24px -4px rgba(99, 102, 241, 0.15)"
              : "0 6px 20px -2px rgba(79, 70, 229, 0.1)",
        },
      }}
    >
      {/* Step Header (Clickable Accordion Trigger) */}
      <Box
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          p: { xs: 2, sm: 2.5 },
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: isExpanded
            ? (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(99, 102, 241, 0.04)"
                  : "rgba(79, 70, 229, 0.03)"
            : "transparent",
          transition: "background-color 0.18s ease",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: -2,
          },
        }}
      >
        {/* Neon Number Badge or Completed Checkmark */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            background: isStepComplete
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.2) 100%)"
              : "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)",
            border: "1px solid",
            borderColor: isStepComplete ? "rgba(16, 185, 129, 0.45)" : "rgba(129, 140, 248, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isStepComplete ? "#34D399" : "#818CF8",
            fontWeight: 800,
            fontSize: "0.95rem",
            flexShrink: 0,
          }}
        >
          {isStepComplete ? <CheckIcon sx={{ fontSize: 20 }} /> : stepIndex + 1}
        </Box>

        {/* Step Title & Description */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "0.96rem", md: "1.05rem" },
              mb: 0.35,
              lineHeight: 1.4,
            }}
          >
            {localizedStepTitle}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              lineHeight: 1.6,
            }}
          >
            {localizedStepDesc}
          </Typography>
        </Box>

        {/* Header Trailing: Meta Badges + Animated Chevron */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            flexShrink: 0,
            alignSelf: "center",
          }}
        >
          {completedCount > 0 && (
            <MetaBadge
              icon={<CheckCircleIcon />}
              label={`${completedCount}/${step.topics.length}`}
              variant="emerald"
            />
          )}

          <MetaBadge
            label={`${step.topics.length} ${t("topics")}`}
            variant="neutral"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          />

          <IconButton
            size="small"
            aria-label={isExpanded ? "Collapse step" : "Expand step"}
            sx={{
              color: "text.secondary",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.04)",
              border: "1px solid",
              borderColor: "divider",
              p: 0.75,
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(99, 102, 241, 0.12)"
                    : "rgba(79, 70, 229, 0.08)",
                color: "text.primary",
              },
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible Topics Container */}
      <Collapse in={isExpanded} timeout={250} unmountOnExit={false}>
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            pb: { xs: 2, sm: 2.5 },
            pt: { xs: 2, sm: 2.5 },
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {step.topics.map((topic, topicIdx) => {
            const localizedTopicTitle = getLocalized(topic.title, topic.title_fa);
            const localizedSummary = getLocalized(topic.summary, topic.summary_fa);
            const questionCount = roadmapRepository.getQuestionCountForTopic(topic.id);
            const topicUrl = `/${language}/stack/${stackSlug}/roadmap/${roadmapSlug}/topic/${topic.slug}`;
            const isCompleted = isTopicCompleted(topic.id);

            return (
              <Box
                key={topic.id}
                component={Link}
                href={topicUrl}
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  p: { xs: 2, sm: 2.25 },
                  borderRadius: 2.5,
                  backgroundColor: isCompleted
                    ? "rgba(16, 185, 129, 0.06)"
                    : (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.02)"
                          : "rgba(0, 0, 0, 0.02)",
                  border: "1px solid",
                  borderColor: isCompleted
                    ? "rgba(16, 185, 129, 0.25)"
                    : "divider",
                  textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: isCompleted
                      ? "rgba(16, 185, 129, 0.1)"
                      : (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(99, 102, 241, 0.08)"
                            : "rgba(79, 70, 229, 0.05)",
                    borderColor: isCompleted
                      ? "rgba(16, 185, 129, 0.4)"
                      : "primary.main",
                    transform: isRtl ? "translateX(-4px)" : "translateX(4px)",
                  },
                }}
              >
                {/* Topic Index & Title/Summary */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.75,
                    flexGrow: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: isCompleted
                        ? "rgba(16, 185, 129, 0.18)"
                        : "rgba(99, 102, 241, 0.15)",
                      color: isCompleted ? "#34D399" : "#818CF8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    {isCompleted ? <CheckIcon sx={{ fontSize: 14 }} /> : topicIdx + 1}
                  </Box>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.86rem",
                        mb: 0.4,
                        lineHeight: 1.45,
                      }}
                    >
                      {localizedTopicTitle}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.76rem",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {localizedSummary}
                    </Typography>
                  </Box>
                </Box>

                {/* Topic Metadata Pills & Action Chevron */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    flexShrink: 0,
                    alignSelf: { xs: "flex-end", sm: "center" },
                  }}
                >
                  {isCompleted && (
                    <MetaBadge
                      label={t("completed")}
                      variant="emerald"
                    />
                  )}

                  {questionCount > 0 && (
                    <MetaBadge
                      icon={<QuizOutlinedIcon />}
                      label={`${questionCount} ${t("questions")}`}
                      variant="sky"
                    />
                  )}

                  <Box
                    sx={{
                      color: "#64748B",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {isRtl ? (
                      <ArrowBackIosNewIcon sx={{ fontSize: 13 }} />
                    ) : (
                      <ArrowForwardIosIcon sx={{ fontSize: 13 }} />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Card>
  );
};
