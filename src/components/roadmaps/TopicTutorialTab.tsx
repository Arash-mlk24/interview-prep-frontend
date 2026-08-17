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
        backgroundColor: "#0F121C",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 3.5,
        overflow: "hidden",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
        <MarkdownRenderer content={tutorialContent} />
      </CardContent>
    </Card>
  );
};
