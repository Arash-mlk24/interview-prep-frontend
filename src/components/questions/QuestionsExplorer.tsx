"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
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

  // Handle Accordion Toggle
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

  // Expand All
  const handleExpandAll = () => {
    const allIds = new Set<string>();
    if (groupingMode === "level") {
      filteredByLevelData.forEach((lvl) =>
        lvl.categoryGroups.forEach((cg) =>
          cg.questions.forEach((q) => allIds.add(q.id))
        )
      );
    } else {
      filteredByCategoryData.forEach((cat) =>
        cat.levelGroups.forEach((lg) =>
          lg.questions.forEach((q) => allIds.add(q.id))
        )
      );
    }
    setExpandedIds(allIds);
  };

  // Collapse All
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <Box>
      {/* Controls Bar */}
      <GroupingControls
        groupingMode={groupingMode}
        onGroupingChange={setGroupingMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        totalFilteredQuestions={totalFilteredQuestions}
      />

      {/* Mode A: Grouped by Level -> Category */}
      {groupingMode === "level" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {filteredByLevelData.map((levelNode) => {
            const levelName = getLocalized(levelNode.level.name, levelNode.level.name_fa);
            return (
              <Box key={levelNode.level.id}>
                {/* Level Section Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    pb: 1.25,
                    mb: 2.5,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                  }}
                >
                  <LayersOutlinedIcon sx={{ color: "#818CF8", fontSize: 19 }} />
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 600, color: "#F8FAFC", fontSize: "1.1rem" }}
                  >
                    {isRtl ? `${t("levelBadgeSuffix")} ${levelName}` : `${levelName} ${t("levelBadgeSuffix")}`}
                  </Typography>
                  <Chip
                    label={`${levelNode.totalQuestions}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: "#94A3B8",
                    }}
                  />
                </Box>

                {/* Subgroups: Categories */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                        <CategoryOutlinedIcon sx={{ color: "#64748B", fontSize: 15 }} />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 500,
                            color: "#CBD5E1",
                            fontSize: "0.85rem",
                          }}
                        >
                          {getLocalized(catGroup.category.name, catGroup.category.name_fa)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.72rem" }}>
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
              </Box>
            );
          })}
        </Box>
      )}

      {/* Mode B: Grouped by Category -> Level */}
      {groupingMode === "category" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {filteredByCategoryData.map((catNode) => (
            <Box key={catNode.category.id}>
              {/* Category Section Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  pb: 1.25,
                  mb: 2.5,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                }}
              >
                <CategoryOutlinedIcon sx={{ color: "#38BDF8", fontSize: 19 }} />
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600, color: "#F8FAFC", fontSize: "1.1rem" }}
                >
                  {getLocalized(catNode.category.name, catNode.category.name_fa)}
                </Typography>
                <Chip
                  label={`${catNode.totalQuestions}`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#94A3B8",
                  }}
                />
              </Box>

              {/* Subgroups: Levels */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                      <LayersOutlinedIcon sx={{ color: "#64748B", fontSize: 15 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 500,
                          color: "#CBD5E1",
                          fontSize: "0.85rem",
                        }}
                      >
                        {getLocalized(lvlGroup.level.name, lvlGroup.level.name_fa)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.72rem" }}>
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
            </Box>
          ))}
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
          <Typography variant="h6" sx={{ color: "#94A3B8", mb: 0.5, fontSize: "0.95rem" }}>
            {t("noQuestionsFound")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.8rem" }}>
            {t("tryAdjustingSearch", { term: searchTerm })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
