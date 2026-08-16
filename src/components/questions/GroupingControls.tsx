"use client";

import React from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Typography,
} from "@mui/material";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { SearchInput } from "../common/SearchInput";
import { useLanguage } from "../../context/LanguageContext";

export type GroupingMode = "level" | "category";

interface GroupingControlsProps {
  groupingMode: GroupingMode;
  onGroupingChange: (mode: GroupingMode) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  totalFilteredQuestions: number;
}

export const GroupingControls: React.FC<GroupingControlsProps> = ({
  groupingMode,
  onGroupingChange,
  searchTerm,
  onSearchChange,
  onExpandAll,
  onCollapseAll,
  totalFilteredQuestions,
}) => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        p: 1.5,
        mb: 3,
        borderRadius: 2.5,
        backgroundColor: "#0F121C",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 1.5,
      }}
    >
      {/* Reusable Search Input */}
      <Box sx={{ flex: 1, maxWidth: { md: 320 } }}>
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={t("searchQuestionsPlaceholder")}
          variant="default"
          showShortcut={true}
        />
      </Box>

      {/* Grouping Mode Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#64748B",
            fontSize: "0.78rem",
            display: { xs: "none", sm: "block" },
          }}
        >
          {t("groupBy")}
        </Typography>
        <ToggleButtonGroup
          value={groupingMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode) onGroupingChange(newMode);
          }}
          size="small"
        >
          <ToggleButton value="level">
            <LayersOutlinedIcon sx={{ fontSize: 15 }} />
            {t("levelFirst")}
          </ToggleButton>
          <ToggleButton value="category">
            <CategoryOutlinedIcon sx={{ fontSize: 15 }} />
            {t("categoryFirst")}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Actions: Total count + Expand/Collapse All */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: { xs: "space-between", md: "flex-end" },
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#64748B", fontSize: "0.78rem", whiteSpace: "nowrap" }}
        >
          {totalFilteredQuestions} {t("questions")}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            onClick={onExpandAll}
            startIcon={<UnfoldMoreIcon sx={{ fontSize: 15 }} />}
            sx={{
              color: "#94A3B8",
              fontSize: "0.78rem",
              px: 1,
              py: 0.35,
              "&:hover": { color: "#F8FAFC", backgroundColor: "rgba(255, 255, 255, 0.04)" },
            }}
          >
            {t("expandAll")}
          </Button>
          <Button
            size="small"
            onClick={onCollapseAll}
            startIcon={<UnfoldLessIcon sx={{ fontSize: 15 }} />}
            sx={{
              color: "#94A3B8",
              fontSize: "0.78rem",
              px: 1,
              py: 0.35,
              "&:hover": { color: "#F8FAFC", backgroundColor: "rgba(255, 255, 255, 0.04)" },
            }}
          >
            {t("collapseAll")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
