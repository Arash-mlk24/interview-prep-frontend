"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLanguage } from "../../context/LanguageContext";

interface AdjacentTopicLink {
  title: string;
  title_fa?: string;
  slug: string;
}

interface TopicNavigationFooterProps {
  prevTopic?: AdjacentTopicLink;
  nextTopic?: AdjacentTopicLink;
  stackSlug: string;
  roadmapSlug: string;
}

export const TopicNavigationFooter: React.FC<TopicNavigationFooterProps> = ({
  prevTopic,
  nextTopic,
  stackSlug,
  roadmapSlug,
}) => {
  const { language, t, getLocalized, isRtl } = useLanguage();

  return (
    <Box
      sx={{
        mt: 5,
        pt: 3,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {/* Previous Topic */}
      {prevTopic ? (
        <Button
          component={Link}
          href={`/${language}/stack/${stackSlug}/roadmap/${roadmapSlug}/topic/${prevTopic.slug}`}
          variant="outlined"
          startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          sx={{
            flex: 1,
            justifyContent: "flex-start",
            p: 2,
            backgroundColor: "#0F121C",
            borderColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 2.5,
            color: "#FFFFFF",
            textTransform: "none",
            "&:hover": {
              borderColor: "#818CF8",
              backgroundColor: "rgba(99, 102, 241, 0.06)",
            },
          }}
        >
          <Box sx={{ ml: 1 }}>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontSize: "0.68rem" }}>
              {t("previousTopic")}
            </Typography>
            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: "0.82rem" }}>
              {getLocalized(prevTopic.title, prevTopic.title_fa)}
            </Typography>
          </Box>
        </Button>
      ) : (
        <Box sx={{ flex: 1 }} />
      )}

      {/* Next Topic */}
      {nextTopic ? (
        <Button
          component={Link}
          href={`/${language}/stack/${stackSlug}/roadmap/${roadmapSlug}/topic/${nextTopic.slug}`}
          variant="outlined"
          endIcon={isRtl ? <ArrowBackIcon /> : <ArrowForwardIcon />}
          sx={{
            flex: 1,
            justifyContent: "flex-end",
            p: 2,
            backgroundColor: "#0F121C",
            borderColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 2.5,
            color: "#FFFFFF",
            textTransform: "none",
            "&:hover": {
              borderColor: "#818CF8",
              backgroundColor: "rgba(99, 102, 241, 0.06)",
            },
          }}
        >
          <Box sx={{ mr: 1 }}>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontSize: "0.68rem" }}>
              {t("nextTopic")}
            </Typography>
            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: "0.82rem" }}>
              {getLocalized(nextTopic.title, nextTopic.title_fa)}
            </Typography>
          </Box>
        </Button>
      ) : (
        <Box sx={{ flex: 1 }} />
      )}
    </Box>
  );
};
