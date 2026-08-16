"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Concept } from "../../data/models";
import { ConceptCard } from "./ConceptCard";
import { SearchInput } from "../common/SearchInput";
import { useLanguage } from "../../context/LanguageContext";

interface ConceptsExplorerProps {
  concepts: Concept[];
  stackName: string;
}

export const ConceptsExplorer: React.FC<ConceptsExplorerProps> = ({
  concepts,
  stackName,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const filteredConcepts = useMemo(() => {
    if (!searchTerm.trim()) return concepts;
    const term = searchTerm.toLowerCase();
    return concepts.filter((c) => {
      const titleEn = c.title.toLowerCase();
      const titleFa = (c.title_fa || "").toLowerCase();
      const contentEn = c.content.toLowerCase();
      const contentFa = (c.content_fa || "").toLowerCase();
      return (
        titleEn.includes(term) ||
        titleFa.includes(term) ||
        contentEn.includes(term) ||
        contentFa.includes(term)
      );
    });
  }, [concepts, searchTerm]);

  return (
    <Box>
      {/* Sleek Search Header */}
      <Box
        sx={{
          p: 1.5,
          mb: 3,
          borderRadius: 2.5,
          backgroundColor: "#0F121C",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ flex: 1, maxWidth: { sm: 340 } }}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("searchConceptsPlaceholder", { name: stackName })}
            variant="default"
            showShortcut={true}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "#64748B", fontSize: "0.78rem", whiteSpace: "nowrap" }}
        >
          {filteredConcepts.length} {t("concepts")}
        </Typography>
      </Box>

      {/* Concepts List */}
      <Box>
        {filteredConcepts.map((concept, index) => (
          <ConceptCard key={concept.id} concept={concept} index={index} />
        ))}
      </Box>

      {/* Empty State */}
      {filteredConcepts.length === 0 && (
        <Box
          sx={{
            py: 7,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "#94A3B8", mb: 0.5, fontSize: "0.95rem" }}>
            {t("noConceptsFound", { term: searchTerm })}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.8rem" }}>
            {t("tryAnotherTopic")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
