"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Concept } from "../../data/models";
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";
import { useLanguage } from "../../context/LanguageContext";

interface ConceptCardProps {
  concept: Concept;
  index: number;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, index }) => {
  const { t, getLocalized } = useLanguage();

  const title = getLocalized(concept.title, concept.title_fa);
  const content = getLocalized(concept.content, concept.content_fa);

  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        mb: 2.5,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "none"
              : "0 4px 16px -2px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "inline-block",
              px: 1,
              py: 0.2,
              borderRadius: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "rgba(2, 132, 199, 0.08)",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#38BDF8" : "#0284C7",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(56, 189, 248, 0.18)"
                  : "rgba(2, 132, 199, 0.2)",
              fontSize: "0.68rem",
              fontWeight: 600,
              mb: 1,
            }}
          >
            {t("conceptNumber", { number: index + 1 })}
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1.05rem",
              lineHeight: 1.45,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Content Body - rendered cleanly without nested wrapper boxes */}
        <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <MarkdownRenderer content={content} />
        </Box>
      </CardContent>
    </Card>
  );
};
