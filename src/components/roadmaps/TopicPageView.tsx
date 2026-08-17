"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  Stack,
  Roadmap,
  RoadmapStep,
  RoadmapTopic,
  Question,
  Category,
  Level,
} from "../../data/models";
import { useLanguage } from "../../context/LanguageContext";
import { useRoadmapProgress } from "../../context/RoadmapProgressContext";
import { TopicTutorialTab } from "./TopicTutorialTab";
import { TopicQuestionsTab } from "./TopicQuestionsTab";
import { TopicNavigationFooter } from "./TopicNavigationFooter";
import { MetaBadge, MetaBadgeVariant } from "../common/MetaBadge";

interface TopicPageViewProps {
  stack: Stack;
  roadmap: Roadmap;
  step: RoadmapStep;
  topic: RoadmapTopic;
  questions: Question[];
  categories: Category[];
  levels: Level[];
  adjacentTopics: {
    prev?: { title: string; title_fa?: string; slug: string };
    next?: { title: string; title_fa?: string; slug: string };
  };
}

function getDifficultyVariant(difficulty: string): MetaBadgeVariant {
  switch (difficulty) {
    case "junior":
      return "emerald";
    case "mid":
      return "sky";
    case "senior":
      return "indigo";
    case "lead":
      return "amber";
    default:
      return "neutral";
  }
}

export const TopicPageView: React.FC<TopicPageViewProps> = ({
  stack,
  roadmap,
  step,
  topic,
  questions,
  categories,
  levels,
  adjacentTopics,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { language, t, getLocalized, isRtl } = useLanguage();
  const { isTopicCompleted, toggleTopicCompleted } = useRoadmapProgress();

  const isCompleted = isTopicCompleted(topic.id);

  const localizedStackName = getLocalized(stack.name, stack.name_fa);
  const localizedRoadmapTitle = getLocalized(roadmap.title, roadmap.title_fa);
  const localizedStepTitle = getLocalized(step.title, step.title_fa);
  const localizedTopicTitle = getLocalized(topic.title, topic.title_fa);
  const localizedTopicSummary = getLocalized(topic.summary, topic.summary_fa);

  const diffVariant = getDifficultyVariant(topic.difficulty);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: { xs: 3.5, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            isRtl ? (
              <NavigateBeforeIcon sx={{ fontSize: 14, color: "#475569" }} />
            ) : (
              <NavigateNextIcon sx={{ fontSize: 14, color: "#475569" }} />
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
              color: "#64748B",
              gap: 0.5,
              fontSize: "0.82rem",
              "&:hover": { color: "#F8FAFC" },
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
              color: "#64748B",
              fontSize: "0.82rem",
              "&:hover": { color: "#F8FAFC" },
            }}
          >
            {localizedStackName}
          </MuiLink>

          <MuiLink
            component={Link}
            href={`/${language}/stack/${stack.slug}/roadmap/${roadmap.slug}`}
            underline="hover"
            sx={{
              color: "#64748B",
              fontSize: "0.82rem",
              "&:hover": { color: "#F8FAFC" },
            }}
          >
            {localizedRoadmapTitle}
          </MuiLink>

          <Typography sx={{ color: "#94A3B8", fontWeight: 500, fontSize: "0.82rem" }}>
            {localizedTopicTitle}
          </Typography>
        </Breadcrumbs>

        {/* Topic Header Banner */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3.5,
            backgroundColor: "#0F121C",
            border: "1px solid",
            borderColor: isCompleted ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.08)",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2.5,
              mb: 2.5,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", alignItems: "center" }}>
              <MetaBadge
                label={localizedStepTitle}
                variant="neutral"
              />

              <MetaBadge
                label={topic.difficulty.toUpperCase()}
                variant={diffVariant}
              />

              <MetaBadge
                icon={<AccessTimeIcon />}
                label={t("readingTime", { minutes: topic.readingTimeMinutes })}
                variant="neutral"
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Progress Toggle Button */}
              <Button
                onClick={() => toggleTopicCompleted(topic.id)}
                size="small"
                variant={isCompleted ? "contained" : "outlined"}
                startIcon={
                  isCompleted ? (
                    <CheckCircleIcon sx={{ fontSize: "15px !important", color: "#FFFFFF" }} />
                  ) : (
                    <CheckCircleOutlinedIcon sx={{ fontSize: "15px !important", color: "#94A3B8" }} />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 0.75,
                  backgroundColor: isCompleted ? "#059669" : "transparent",
                  color: isCompleted ? "#FFFFFF" : "#CBD5E1",
                  borderColor: isCompleted ? "#059669" : "rgba(255, 255, 255, 0.15)",
                  "&:hover": {
                    backgroundColor: isCompleted ? "#047857" : "rgba(16, 185, 129, 0.08)",
                    borderColor: isCompleted ? "#047857" : "#10B981",
                    color: isCompleted ? "#FFFFFF" : "#34D399",
                  },
                }}
              >
                {isCompleted ? t("markIncomplete") : t("markCompleted")}
              </Button>

              <Button
                component={Link}
                href={`/${language}/stack/${stack.slug}/roadmap/${roadmap.slug}`}
                size="small"
                startIcon={
                  isRtl ? (
                    <ArrowForwardIcon sx={{ fontSize: "14px !important" }} />
                  ) : (
                    <ArrowBackIcon sx={{ fontSize: "14px !important" }} />
                  )
                }
                sx={{
                  color: "#64748B",
                  fontSize: "0.8rem",
                  textTransform: "none",
                  display: { xs: "none", sm: "inline-flex" },
                  "&:hover": { color: "#F8FAFC" },
                }}
              >
                {t("backToRoadmap")}
              </Button>
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#FFFFFF",
              fontSize: { xs: "1.25rem", md: "1.55rem" },
              mb: 1.5,
              lineHeight: 1.4,
            }}
          >
            {localizedTopicTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#94A3B8",
              fontSize: "0.86rem",
              lineHeight: 1.75,
              maxWidth: 900,
            }}
          >
            {localizedTopicSummary}
          </Typography>
        </Box>

        {/* Dual Navigation Tabs */}
        <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", mb: 3.5 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="topic sections"
          >
            <Tab
              icon={<MenuBookIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={t("completeTutorial")}
              id="topic-tab-0"
              aria-controls="topic-tabpanel-0"
            />
            <Tab
              icon={<QuizOutlinedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={`${t("interviewQuestions")} (${questions.length})`}
              id="topic-tab-1"
              aria-controls="topic-tabpanel-1"
            />
          </Tabs>
        </Box>

        {/* Tab 0: Comprehensive Guide */}
        {activeTab === 0 && (
          <Box role="tabpanel" id="topic-tabpanel-0" aria-labelledby="topic-tab-0">
            <TopicTutorialTab topic={topic} />
          </Box>
        )}

        {/* Tab 1: Linked Interview Questions */}
        {activeTab === 1 && (
          <Box role="tabpanel" id="topic-tabpanel-1" aria-labelledby="topic-tab-1">
            <TopicQuestionsTab
              questions={questions}
              categories={categories}
              levels={levels}
            />
          </Box>
        )}

        {/* Next / Previous Topic Navigation Footer */}
        <TopicNavigationFooter
          prevTopic={adjacentTopics.prev}
          nextTopic={adjacentTopics.next}
          stackSlug={stack.slug}
          roadmapSlug={roadmap.slug}
        />
      </Container>
    </Box>
  );
};
