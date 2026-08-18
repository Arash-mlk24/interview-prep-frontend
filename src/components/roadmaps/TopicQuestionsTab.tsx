"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { Question, Level, Category } from "../../data/models";
import { QuestionAccordion } from "../questions/QuestionAccordion";
import { useLanguage } from "../../context/LanguageContext";

interface TopicQuestionsTabProps {
  questions: Question[];
  categories: Category[];
  levels: Level[];
}

export const TopicQuestionsTab: React.FC<TopicQuestionsTabProps> = ({
  questions,
  categories,
  levels,
}) => {
  const { t, isRtl } = useLanguage();
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const handleAccordionChange = (id: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: isExpanded,
    }));
  };

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    questions.forEach((q) => {
      next[q.id] = true;
    });
    setExpandedMap(next);
  };

  const handleCollapseAll = () => {
    setExpandedMap({});
  };

  if (questions.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
          backgroundColor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <QuizOutlinedIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1.5 }} />
        <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
          {t("noQuestionsForTopic")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Controls Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", fontWeight: 500 }}>
          {questions.length} {t("questions")}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            onClick={handleExpandAll}
            startIcon={<UnfoldMoreIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              textTransform: "none",
              "&:hover": { color: "text.primary" },
            }}
          >
            {t("expandAll")}
          </Button>
          <Button
            size="small"
            onClick={handleCollapseAll}
            startIcon={<UnfoldLessIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              textTransform: "none",
              "&:hover": { color: "text.primary" },
            }}
          >
            {t("collapseAll")}
          </Button>
        </Box>
      </Box>

      {/* Questions Accordion List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {questions.map((question) => {
          const category = categories.find((c) => c.id === question.categoryId);
          const level = levels.find((l) => l.id === question.levelId);
          const isExpanded = !!expandedMap[question.id];

          return (
            <QuestionAccordion
              key={question.id}
              question={question}
              category={category}
              level={level}
              expanded={isExpanded}
              onChange={handleAccordionChange(question.id)}
              showBadges={true}
            />
          );
        })}
      </Box>
    </Box>
  );
};
