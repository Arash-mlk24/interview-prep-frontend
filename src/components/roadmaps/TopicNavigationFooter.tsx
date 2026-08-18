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
        borderTop: "1px solid",
        borderColor: "divider",
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
            backgroundColor: "background.paper",
            borderColor: "divider",
            borderRadius: 2.5,
            color: "text.primary",
            textTransform: "none",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(99, 102, 241, 0.06)"
                  : "rgba(79, 70, 229, 0.04)",
            },
          }}
        >
          <Box sx={{ ml: isRtl ? 0 : 1, mr: isRtl ? 1 : 0 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.68rem" }}>
              {t("previousTopic")}
            </Typography>
            <Typography sx={{ color: "text.primary", fontWeight: 600, fontSize: "0.82rem" }}>
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
            backgroundColor: "background.paper",
            borderColor: "divider",
            borderRadius: 2.5,
            color: "text.primary",
            textTransform: "none",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(99, 102, 241, 0.06)"
                  : "rgba(79, 70, 229, 0.04)",
            },
          }}
        >
          <Box sx={{ mr: isRtl ? 0 : 1, ml: isRtl ? 1 : 0, textAlign: isRtl ? "left" : "right" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.68rem" }}>
              {t("nextTopic")}
            </Typography>
            <Typography sx={{ color: "text.primary", fontWeight: 600, fontSize: "0.82rem" }}>
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
