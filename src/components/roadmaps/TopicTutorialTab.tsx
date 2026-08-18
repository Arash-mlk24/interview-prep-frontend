"use client";

import React from "react";
import { Card, CardContent } from "@mui/material";
import { RoadmapTopic } from "../../data/models";
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";
import { useLanguage } from "../../context/LanguageContext";

interface TopicTutorialTabProps {
  topic: RoadmapTopic;
}

export const TopicTutorialTab: React.FC<TopicTutorialTabProps> = ({ topic }) => {
  const { getLocalized } = useLanguage();
  const tutorialContent = getLocalized(topic.content, topic.content_fa);

  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3.5,
        overflow: "hidden",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px -2px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
        <MarkdownRenderer content={tutorialContent} />
      </CardContent>
    </Card>
  );
};
