"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Question, Level, Category } from "../../data/models";
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";
import { useLanguage } from "../../context/LanguageContext";

interface QuestionAccordionProps {
  question: Question;
  level?: Level;
  category?: Category;
  expanded?: boolean;
  onChange?: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  showBadges?: boolean;
}

function getLevelChipColor(levelId?: string, isDark: boolean = true) {
  if (!isDark) {
    switch (levelId) {
      case "junior":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#047857", border: "1px solid rgba(16, 185, 129, 0.25)" };
      case "mid":
        return { bg: "rgba(2, 132, 199, 0.1)", color: "#0369A1", border: "1px solid rgba(2, 132, 199, 0.25)" };
      case "senior":
        return { bg: "rgba(79, 70, 229, 0.1)", color: "#4338CA", border: "1px solid rgba(79, 70, 229, 0.25)" };
      case "lead":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "#B45309", border: "1px solid rgba(245, 158, 11, 0.25)" };
      default:
        return { bg: "rgba(0, 0, 0, 0.04)", color: "#475569", border: "1px solid rgba(0, 0, 0, 0.08)" };
    }
  }

  switch (levelId) {
    case "junior":
      return { bg: "rgba(16, 185, 129, 0.08)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.2)" };
    case "mid":
      return { bg: "rgba(56, 189, 248, 0.08)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.2)" };
    case "senior":
      return { bg: "rgba(99, 102, 241, 0.08)", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.2)" };
    case "lead":
      return { bg: "rgba(245, 158, 11, 0.08)", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.2)" };
    default:
      return { bg: "rgba(148, 163, 184, 0.08)", color: "#CBD5E1", border: "1px solid rgba(148, 163, 184, 0.2)" };
  }
}

export const QuestionAccordion: React.FC<QuestionAccordionProps> = ({
  question,
  level,
  category,
  expanded,
  onChange,
  showBadges = true,
}) => {
  const { getLocalized } = useLanguage();

  const title = getLocalized(question.questionTitle, question.questionTitle_fa);
  const answer = getLocalized(question.answerContent, question.answerContent_fa);

  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
        aria-controls={`panel-${question.id}-content`}
        id={`panel-${question.id}-header`}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%", minWidth: 0 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              component="h3"
              sx={{
                fontWeight: 500,
                color: "text.primary",
                lineHeight: 1.5,
                fontSize: "0.9rem",
                mb: showBadges ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>

            {showBadges && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, flexWrap: "wrap", mt: 0.5 }}>
                {level && (
                  <Chip
                    label={getLocalized(level.name, level.name_fa)}
                    size="small"
                    sx={(theme) => {
                      const levelStyle = getLevelChipColor(level?.id || question.levelId, theme.palette.mode === "dark");
                      return {
                        height: 18,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        backgroundColor: levelStyle.bg,
                        color: levelStyle.color,
                        border: levelStyle.border,
                      };
                    }}
                  />
                )}
                {category && (
                  <Chip
                    label={getLocalized(category.name, category.name_fa)}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(0, 0, 0, 0.04)",
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <MarkdownRenderer content={answer} />
      </AccordionDetails>
    </Accordion>
  );
};
