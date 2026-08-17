"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
    <Box
      sx={{
        backgroundColor: "#0F121C",
        border: "1px solid",
        borderColor: isStepComplete
          ? "rgba(16, 185, 129, 0.25)"
          : isExpanded
          ? "rgba(129, 140, 248, 0.22)"
          : "rgba(255, 255, 255, 0.08)",
        borderRadius: 3.5,
        mb: 3,
        position: "relative",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          borderColor: isStepComplete
            ? "rgba(16, 185, 129, 0.4)"
            : "rgba(129, 140, 248, 0.35)",
          boxShadow: "0 8px 24px -6px rgba(0, 0, 0, 0.45)",
        },
      }}
    >
      {/* Clickable Step Header */}
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
          alignItems: "flex-start",
          gap: 2.5,
          p: { xs: 2.5, sm: 3, md: 3.5 },
          cursor: "pointer",
          userSelect: "none",
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.02)",
          },
          "&:focus-visible": {
            outline: "2px solid #818CF8",
            outlineOffset: -2,
          },
        }}
      >
        {/* Neon Number Badge or Completed Checkmark */}
        <Box
          sx={{
            width: 44,
            height: 44,
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
            fontSize: "1.1rem",
            flexShrink: 0,
          }}
        >
          {isStepComplete ? <CheckIcon sx={{ fontSize: 22 }} /> : stepIndex + 1}
        </Box>

        {/* Step Title & Description */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              mb: 0.5,
              lineHeight: 1.4,
              textAlign: isRtl ? "right" : "left",
              direction: isRtl ? "rtl" : "ltr",
            }}
          >
            {localizedStepTitle}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              fontSize: "0.86rem",
              lineHeight: 1.6,
              textAlign: isRtl ? "right" : "left",
              direction: isRtl ? "rtl" : "ltr",
            }}
          >
            {localizedStepDesc}
          </Typography>
        </Box>

        {/* Header Right: Meta Badges + Animated Chevron */}
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
              color: "#94A3B8",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              p: 0.75,
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                color: "#F8FAFC",
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
            px: { xs: 2.5, sm: 3, md: 3.5 },
            pb: { xs: 2.5, sm: 3, md: 3.5 },
            pt: 0.5,
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
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
                    ? "rgba(16, 185, 129, 0.04)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: "1px solid",
                  borderColor: isCompleted
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                  textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: isCompleted
                      ? "rgba(16, 185, 129, 0.08)"
                      : "rgba(99, 102, 241, 0.08)",
                    borderColor: isCompleted
                      ? "rgba(16, 185, 129, 0.35)"
                      : "rgba(129, 140, 248, 0.3)",
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
                    textAlign: isRtl ? "right" : "left",
                    direction: isRtl ? "rtl" : "ltr",
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: isCompleted
                        ? "rgba(16, 185, 129, 0.18)"
                        : "rgba(99, 102, 241, 0.15)",
                      color: isCompleted ? "#34D399" : "#818CF8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    {isCompleted ? <CheckIcon sx={{ fontSize: 15 }} /> : topicIdx + 1}
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{
                        color: isCompleted ? "#F1F5F9" : "#F8FAFC",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        mb: 0.4,
                        lineHeight: 1.45,
                      }}
                    >
                      {localizedTopicTitle}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748B",
                        fontSize: "0.82rem",
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

                  <MetaBadge
                    icon={<AccessTimeIcon />}
                    label={t("readingTime", { minutes: topic.readingTimeMinutes })}
                    variant="neutral"
                  />

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
                      ml: isRtl ? 0 : 0.5,
                      mr: isRtl ? 0.5 : 0,
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
    </Box>
  );
};
