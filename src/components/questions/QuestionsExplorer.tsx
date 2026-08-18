"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  Collapse,
  IconButton,
} from "@mui/material";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  GroupedByLevelNode,
  GroupedByCategoryNode,
  Question,
} from "../../data/models";
import { QuestionAccordion } from "./QuestionAccordion";
import { GroupingControls, GroupingMode } from "./GroupingControls";
import { useLanguage } from "../../context/LanguageContext";

interface QuestionsExplorerProps {
  stackId: string;
  byLevelData: GroupedByLevelNode[];
  byCategoryData: GroupedByCategoryNode[];
}

export const QuestionsExplorer: React.FC<QuestionsExplorerProps> = ({
  stackId,
  byLevelData,
  byCategoryData,
}) => {
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("level");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  // Single active open group at a time, default closed (null)
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const { t, getLocalized, isRtl } = useLanguage();

  // Filter function searching both English and Persian titles and contents
  const matchesSearch = (q: Question) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleEn = q.questionTitle.toLowerCase();
    const titleFa = (q.questionTitle_fa || "").toLowerCase();
    const answerEn = q.answerContent.toLowerCase();
    const answerFa = (q.answerContent_fa || "").toLowerCase();

    return (
      titleEn.includes(term) ||
      titleFa.includes(term) ||
      answerEn.includes(term) ||
      answerFa.includes(term)
    );
  };

  // Filtered By Level Data
  const filteredByLevelData = useMemo(() => {
    return byLevelData
      .map((levelNode) => {
        const categoryGroups = levelNode.categoryGroups
          .map((catGroup) => ({
            ...catGroup,
            questions: catGroup.questions.filter(matchesSearch),
          }))
          .filter((catGroup) => catGroup.questions.length > 0);

        const totalQuestions = categoryGroups.reduce(
          (acc, g) => acc + g.questions.length,
          0
        );

        return {
          ...levelNode,
          categoryGroups,
          totalQuestions,
        };
      })
      .filter((levelNode) => levelNode.totalQuestions > 0);
  }, [byLevelData, searchTerm]);

  // Filtered By Category Data
  const filteredByCategoryData = useMemo(() => {
    return byCategoryData
      .map((catNode) => {
        const levelGroups = catNode.levelGroups
          .map((lvlGroup) => ({
            ...lvlGroup,
            questions: lvlGroup.questions.filter(matchesSearch),
          }))
          .filter((lvlGroup) => lvlGroup.questions.length > 0);

        const totalQuestions = levelGroups.reduce(
          (acc, g) => acc + g.questions.length,
          0
        );

        return {
          ...catNode,
          levelGroups,
          totalQuestions,
        };
      })
      .filter((catNode) => catNode.totalQuestions > 0);
  }, [byCategoryData, searchTerm]);

  // Total filtered questions count
  const totalFilteredQuestions = useMemo(() => {
    return filteredByLevelData.reduce((acc, l) => acc + l.totalQuestions, 0);
  }, [filteredByLevelData]);

  // Toggle exclusive single group (accordion mode)
  const handleGroupToggle = (groupId: string) => {
    setExpandedGroupId((current) => (current === groupId ? null : groupId));
  };

  // Switch grouping mode and close any opened group
  const handleGroupingModeChange = (mode: GroupingMode) => {
    setGroupingMode(mode);
    setExpandedGroupId(null);
  };

  // Handle individual Question Accordion Toggle
  const handleAccordionChange =
    (questionId: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (isExpanded) {
          next.add(questionId);
        } else {
          next.delete(questionId);
        }
        return next;
      });
    };

  // Expand All Question Answers
  const handleExpandAll = () => {
    const allIds = new Set<string>();
    if (groupingMode === "level") {
      filteredByLevelData.forEach((lvl) =>
        lvl.categoryGroups.forEach((cg) =>
          cg.questions.forEach((q) => allIds.add(q.id))
        )
      );
      // If no group is open, open the first group to show answers
      if (!expandedGroupId && filteredByLevelData.length > 0) {
        setExpandedGroupId(filteredByLevelData[0].level.id);
      }
    } else {
      filteredByCategoryData.forEach((cat) =>
        cat.levelGroups.forEach((lg) =>
          lg.questions.forEach((q) => allIds.add(q.id))
        )
      );
      if (!expandedGroupId && filteredByCategoryData.length > 0) {
        setExpandedGroupId(filteredByCategoryData[0].category.id);
      }
    }
    setExpandedIds(allIds);
  };

  // Collapse All (both questions and active group)
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
    setExpandedGroupId(null);
  };

  return (
    <Box>
      {/* Controls Bar */}
      <GroupingControls
        groupingMode={groupingMode}
        onGroupingChange={handleGroupingModeChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        totalFilteredQuestions={totalFilteredQuestions}
      />

      {/* Mode A: Grouped by Level -> Category (Collapsible Exclusive Accordion) */}
      {groupingMode === "level" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredByLevelData.map((levelNode) => {
            const levelName = getLocalized(levelNode.level.name, levelNode.level.name_fa);
            const isGroupExpanded = expandedGroupId === levelNode.level.id;
            const formattedTitle = isRtl
              ? `${t("levelBadgeSuffix")} ${levelName}`
              : `${levelName} ${t("levelBadgeSuffix")}`;

            return (
              <Card
                key={levelNode.level.id}
                sx={{
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: isGroupExpanded ? "primary.main" : "divider",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  boxShadow: isGroupExpanded
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "0 4px 20px -2px rgba(99, 102, 241, 0.12)"
                          : "0 4px 20px -2px rgba(79, 70, 229, 0.08)"
                    : "none",
                }}
              >
                {/* Level Header Button */}
                <Box
                  onClick={() => handleGroupToggle(levelNode.level.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isGroupExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleGroupToggle(levelNode.level.id);
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: { xs: 2, sm: 2.5 },
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: isGroupExpanded
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(99, 102, 241, 0.05)"
                            : "rgba(79, 70, 229, 0.03)"
                      : "transparent",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(99, 102, 241, 0.12)"
                            : "rgba(79, 70, 229, 0.08)",
                        color: "primary.main",
                        flexShrink: 0,
                      }}
                    >
                      <LayersOutlinedIcon sx={{ fontSize: 19 }} />
                    </Box>

                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                      }}
                    >
                      {formattedTitle}
                    </Typography>

                    <Chip
                      label={`${levelNode.totalQuestions} ${t("questions")}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                        color: "text.secondary",
                      }}
                    />
                  </Box>

                  <IconButton
                    size="small"
                    sx={{
                      color: "text.secondary",
                      transform: isGroupExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    aria-label={isGroupExpanded ? "Collapse" : "Expand"}
                  >
                    <KeyboardArrowDownIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                </Box>

                {/* Subgroups: Categories and Questions */}
                <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      pt: { xs: 2, sm: 2.5 },
                      borderTop: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    {levelNode.categoryGroups.map((catGroup) => (
                      <Box key={catGroup.category.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1.25,
                            paddingInlineStart: "2px",
                          }}
                        >
                          <CategoryOutlinedIcon sx={{ color: "text.secondary", fontSize: 15 }} />
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 500,
                              color: "text.primary",
                              fontSize: "0.85rem",
                            }}
                          >
                            {getLocalized(catGroup.category.name, catGroup.category.name_fa)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                            ({catGroup.questions.length})
                          </Typography>
                        </Box>

                        {/* Question Accordions */}
                        <Box>
                          {catGroup.questions.map((question) => (
                            <QuestionAccordion
                              key={question.id}
                              question={question}
                              level={levelNode.level}
                              category={catGroup.category}
                              expanded={expandedIds.has(question.id)}
                              onChange={handleAccordionChange(question.id)}
                              showBadges={false}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Mode B: Grouped by Category -> Level (Collapsible Exclusive Accordion) */}
      {groupingMode === "category" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredByCategoryData.map((catNode) => {
            const catTitle = getLocalized(catNode.category.name, catNode.category.name_fa);
            const isGroupExpanded = expandedGroupId === catNode.category.id;

            return (
              <Card
                key={catNode.category.id}
                sx={{
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: isGroupExpanded ? "primary.main" : "divider",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  boxShadow: isGroupExpanded
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "0 4px 20px -2px rgba(99, 102, 241, 0.12)"
                          : "0 4px 20px -2px rgba(79, 70, 229, 0.08)"
                    : "none",
                }}
              >
                {/* Category Header Button */}
                <Box
                  onClick={() => handleGroupToggle(catNode.category.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isGroupExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleGroupToggle(catNode.category.id);
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: { xs: 2, sm: 2.5 },
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: isGroupExpanded
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(99, 102, 241, 0.05)"
                            : "rgba(79, 70, 229, 0.03)"
                      : "transparent",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(56, 189, 248, 0.12)"
                            : "rgba(2, 132, 199, 0.08)",
                        color: "secondary.main",
                        flexShrink: 0,
                      }}
                    >
                      <CategoryOutlinedIcon sx={{ fontSize: 19 }} />
                    </Box>

                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                      }}
                    >
                      {catTitle}
                    </Typography>

                    <Chip
                      label={`${catNode.totalQuestions} ${t("questions")}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                        color: "text.secondary",
                      }}
                    />
                  </Box>

                  <IconButton
                    size="small"
                    sx={{
                      color: "text.secondary",
                      transform: isGroupExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    aria-label={isGroupExpanded ? "Collapse" : "Expand"}
                  >
                    <KeyboardArrowDownIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                </Box>

                {/* Subgroups: Levels and Questions */}
                <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      pt: { xs: 2, sm: 2.5 },
                      borderTop: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    {catNode.levelGroups.map((lvlGroup) => (
                      <Box key={lvlGroup.level.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1.25,
                            paddingInlineStart: "2px",
                          }}
                        >
                          <LayersOutlinedIcon sx={{ color: "text.secondary", fontSize: 15 }} />
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 500,
                              color: "text.primary",
                              fontSize: "0.85rem",
                            }}
                          >
                            {getLocalized(lvlGroup.level.name, lvlGroup.level.name_fa)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                            ({lvlGroup.questions.length})
                          </Typography>
                        </Box>

                        {/* Question Accordions */}
                        <Box>
                          {lvlGroup.questions.map((question) => (
                            <QuestionAccordion
                              key={question.id}
                              question={question}
                              level={lvlGroup.level}
                              category={catNode.category}
                              expanded={expandedIds.has(question.id)}
                              onChange={handleAccordionChange(question.id)}
                              showBadges={false}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Empty Search Results */}
      {totalFilteredQuestions === 0 && (
        <Box
          sx={{
            py: 7,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.95rem" }}>
            {t("noQuestionsFound")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled", fontSize: "0.8rem" }}>
            {t("tryAdjustingSearch", { term: searchTerm })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
