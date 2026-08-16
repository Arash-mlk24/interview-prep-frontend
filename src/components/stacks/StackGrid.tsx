"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Stack, Category } from "../../data/models";
import { StackCard } from "./StackCard";
import { SearchInput } from "../common/SearchInput";
import { useLanguage } from "../../context/LanguageContext";

interface StackItemData {
  stack: Stack;
  stats: {
    questionCount: number;
    conceptCount: number;
    categoryCount: number;
  };
  categories: Category[];
}

interface StackGridProps {
  stacksData: StackItemData[];
}

export const StackGrid: React.FC<StackGridProps> = ({ stacksData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const filteredStacks = useMemo(() => {
    if (!searchTerm.trim()) return stacksData;
    const term = searchTerm.toLowerCase();
    return stacksData.filter((item) => {
      const nameEn = item.stack.name.toLowerCase();
      const nameFa = (item.stack.name_fa || "").toLowerCase();
      const descEn = item.stack.description.toLowerCase();
      const descFa = (item.stack.description_fa || "").toLowerCase();
      const matchCat = item.categories.some(
        (cat) =>
          cat.name.toLowerCase().includes(term) ||
          (cat.name_fa || "").toLowerCase().includes(term)
      );

      return (
        nameEn.includes(term) ||
        nameFa.includes(term) ||
        descEn.includes(term) ||
        descFa.includes(term) ||
        matchCat
      );
    });
  }, [stacksData, searchTerm]);

  return (
    <Box>
      {/* Reusable Hero Search Input */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t("filterPlaceholder")}
          variant="hero"
          maxWidth={480}
          showShortcut={true}
        />
      </Box>

      {/* Responsive Grid of Stack Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {filteredStacks.map((item) => (
          <StackCard
            key={item.stack.id}
            stack={item.stack}
            stats={item.stats}
            categories={item.categories}
          />
        ))}
      </Box>

      {/* Empty State */}
      {filteredStacks.length === 0 && (
        <Box sx={{ textAlign: "center", py: 7 }}>
          <Typography variant="h6" sx={{ color: "#94A3B8", mb: 0.5, fontSize: "0.95rem" }}>
            {t("noStacksFound", { term: searchTerm })}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.8rem" }}>
            {t("trySearching")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
