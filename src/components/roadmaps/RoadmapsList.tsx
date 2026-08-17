"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LayersIcon from "@mui/icons-material/Layers";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Roadmap } from "../../data/models";
import { useLanguage } from "../../context/LanguageContext";
import { MetaBadge } from "../common/MetaBadge";

interface RoadmapsListProps {
  roadmaps: Roadmap[];
  stackSlug: string;
}

export const RoadmapsList: React.FC<RoadmapsListProps> = ({ roadmaps, stackSlug }) => {
  const { language, t, getLocalized, isRtl } = useLanguage();

  if (roadmaps.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography sx={{ color: "#94A3B8" }}>
          {language === "fa"
            ? "هیچ نقشه راهی برای این فناوری تعریف نشده است."
            : "No roadmaps available for this stack yet."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 3,
        }}
      >
        {roadmaps.map((roadmap) => {
          const localizedTitle = getLocalized(roadmap.title, roadmap.title_fa);
          const localizedDesc = getLocalized(roadmap.description, roadmap.description_fa);
          const localizedLevel = getLocalized(roadmap.targetLevel, roadmap.targetLevel_fa);
          const totalTopics = roadmap.steps.reduce((acc, s) => acc + s.topics.length, 0);

          return (
            <Card
              key={roadmap.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0F121C",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 3.5,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "rgba(129, 140, 248, 0.35)",
                  boxShadow: "0 12px 30px -10px rgba(99, 102, 241, 0.2)",
                },
              }}
            >
              {/* Top Accent Gradient Bar */}
              <Box
                sx={{
                  height: 3,
                  background: "linear-gradient(90deg, #6366F1 0%, #38BDF8 100%)",
                }}
              />

              <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Header Badges */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                    <MetaBadge
                      icon={<AltRouteIcon />}
                      label={localizedLevel}
                      variant="indigo"
                    />
                    <MetaBadge
                      icon={<AccessTimeIcon />}
                      label={t("estimatedHours", { hours: roadmap.estimatedHours })}
                      variant="sky"
                    />
                  </Box>
                </Box>

                {/* Title & Description */}
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontSize: "1.15rem",
                    mb: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {localizedTitle}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#94A3B8",
                    fontSize: "0.86rem",
                    lineHeight: 1.6,
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  {localizedDesc}
                </Typography>

                {/* Stats & CTA Footer */}
                <Box
                  sx={{
                    pt: 2,
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: "auto",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LayersIcon sx={{ fontSize: 16, color: "#64748B" }} />
                      <Typography sx={{ color: "#94A3B8", fontSize: "0.78rem" }}>
                        {roadmap.steps.length} {t("steps")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <MenuBookIcon sx={{ fontSize: 16, color: "#64748B" }} />
                      <Typography sx={{ color: "#94A3B8", fontSize: "0.78rem" }}>
                        {totalTopics} {t("topics")}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    component={Link}
                    href={`/${language}/stack/${stackSlug}/roadmap/${roadmap.slug}`}
                    variant="contained"
                    size="small"
                    endIcon={isRtl ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    sx={{
                      backgroundColor: "#1E2235",
                      color: "#E2E8F0",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2,
                      py: 0.75,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        backgroundColor: "#6366F1",
                        color: "#FFFFFF",
                        borderColor: "#6366F1",
                      },
                    }}
                  >
                    {t("startRoadmap")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};
