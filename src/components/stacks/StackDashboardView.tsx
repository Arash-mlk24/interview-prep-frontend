"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import HomeIcon from "@mui/icons-material/Home";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import TerminalIcon from "@mui/icons-material/Terminal";
import WebIcon from "@mui/icons-material/Web";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import {
  Stack,
  Category,
  GroupedByLevelNode,
  GroupedByCategoryNode,
  Concept,
} from "../../data/models";
import { QuestionsExplorer } from "../questions/QuestionsExplorer";
import { ConceptsExplorer } from "../concepts/ConceptsExplorer";
import { useLanguage } from "../../context/LanguageContext";

interface StackDashboardViewProps {
  stack: Stack;
  stats: {
    questionCount: number;
    conceptCount: number;
    categoryCount: number;
  };
  categories: Category[];
  byLevelData: GroupedByLevelNode[];
  byCategoryData: GroupedByCategoryNode[];
  concepts: Concept[];
}

function getStackIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "dotnet":
      return <IntegrationInstructionsIcon sx={{ fontSize: 24, color: "#818CF8" }} />;
    case "react":
      return <WebIcon sx={{ fontSize: 24, color: "#38BDF8" }} />;
    case "typescript":
      return <TerminalIcon sx={{ fontSize: 24, color: "#60A5FA" }} />;
    default:
      return <TerminalIcon sx={{ fontSize: 24, color: "#818CF8" }} />;
  }
}

export const StackDashboardView: React.FC<StackDashboardViewProps> = ({
  stack,
  stats,
  categories,
  byLevelData,
  byCategoryData,
  concepts,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { language, t, getLocalized, isRtl } = useLanguage();

  const localizedName = getLocalized(stack.name, stack.name_fa);
  const localizedDesc = getLocalized(stack.description, stack.description_fa);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Minimal Breadcrumbs */}
        <Breadcrumbs
          separator={
            isRtl ? (
              <NavigateBeforeIcon sx={{ fontSize: 14, color: "#475569" }} />
            ) : (
              <NavigateNextIcon sx={{ fontSize: 14, color: "#475569" }} />
            )
          }
          aria-label="breadcrumb"
          sx={{ mb: 2.5 }}
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
              fontSize: "0.8rem",
              transition: "color 0.15s ease",
              "&:hover": { color: "#F8FAFC" },
            }}
          >
            <HomeIcon sx={{ fontSize: 15 }} />
            {t("allStacks")}
          </MuiLink>
          <Typography sx={{ color: "#94A3B8", fontWeight: 500, fontSize: "0.8rem" }}>
            {localizedName}
          </Typography>
        </Breadcrumbs>

        {/* Minimal Header Banner */}
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: 3,
            backgroundColor: "#0F121C",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2.5,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {getStackIcon(stack.icon)}
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontSize: { xs: "1.25rem", md: "1.45rem" },
                  mb: 0.5,
                }}
              >
                {localizedName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#94A3B8", maxWidth: 640, lineHeight: 1.6, fontSize: "0.85rem" }}
              >
                {localizedDesc}
              </Typography>
            </Box>
          </Box>

          {/* Quick Metrics */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontSize: "0.68rem" }}>
                {t("questions")}
              </Typography>
              <Typography sx={{ fontWeight: 700, color: "#818CF8", fontSize: "0.95rem" }}>
                {stats.questionCount}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontSize: "0.68rem" }}>
                {t("concepts")}
              </Typography>
              <Typography sx={{ fontWeight: 700, color: "#38BDF8", fontSize: "0.95rem" }}>
                {stats.conceptCount}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Minimal Navigation Tabs */}
        <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="stack sections"
          >
            <Tab
              icon={<QuizOutlinedIcon sx={{ fontSize: 17 }} />}
              iconPosition="start"
              label={t("interviewQuestionsTab", { count: stats.questionCount })}
              id="stack-tab-0"
              aria-controls="stack-tabpanel-0"
            />
            <Tab
              icon={<LightbulbOutlinedIcon sx={{ fontSize: 17 }} />}
              iconPosition="start"
              label={t("conceptsTab", { count: stats.conceptCount })}
              id="stack-tab-1"
              aria-controls="stack-tabpanel-1"
            />
          </Tabs>
        </Box>

        {/* Tab 0: Questions Explorer */}
        {activeTab === 0 && (
          <Box role="tabpanel" id="stack-tabpanel-0" aria-labelledby="stack-tab-0">
            <QuestionsExplorer
              stackId={stack.id}
              byLevelData={byLevelData}
              byCategoryData={byCategoryData}
            />
          </Box>
        )}

        {/* Tab 1: Concepts Explorer */}
        {activeTab === 1 && (
          <Box role="tabpanel" id="stack-tabpanel-1" aria-labelledby="stack-tab-1">
            <ConceptsExplorer concepts={concepts} stackName={localizedName} />
          </Box>
        )}
      </Container>
    </Box>
  );
};
