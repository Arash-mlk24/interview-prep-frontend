"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

interface MarkdownRendererProps {
  content: string;
}

const MONO_FONT = 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace';

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { isRtl } = useLanguage();

  return (
    <Box
      dir={isRtl ? "rtl" : "ltr"}
      sx={{
        color: "#CBD5E1",
        fontSize: "0.9rem",
        lineHeight: 1.75,
        textAlign: isRtl ? "right" : "left",

        // ── Paragraphs ─────────────────────────────────────────
        "& p": {
          marginBottom: "0.85rem",
          "&:last-child": { marginBottom: 0 },
        },

        // ── Headings ───────────────────────────────────────────
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          fontWeight: 600,
          marginTop: "1.25rem",
          marginBottom: "0.5rem",
          lineHeight: 1.35,
          color: "#F8FAFC",
          letterSpacing: isRtl ? "0" : "-0.01em",
          "&:first-of-type": { marginTop: "0.15rem" },
        },
        "& h1": { fontSize: "1.35rem" },
        "& h2": { fontSize: "1.2rem" },
        "& h3": { fontSize: "1.05rem", color: "#818CF8" },
        "& h4": { fontSize: "0.95rem", color: "#94A3B8" },
        "& h5, & h6": { fontSize: "0.9rem", color: "#94A3B8" },

        // ── Lists ──────────────────────────────────────────────
        "& ul, & ol": {
          paddingInlineStart: "1.4rem",
          paddingInlineEnd: "0",
          marginBottom: "0.85rem",
        },
        "& li": {
          marginBottom: "0.3rem",
          lineHeight: 1.7,
        },
        "& li > ul, & li > ol": {
          marginBottom: 0,
          marginTop: "0.2rem",
        },

        // ── Strong / Em ────────────────────────────────────────
        "& strong": {
          color: "#F8FAFC",
          fontWeight: 600,
        },
        "& em": {
          color: "#94A3B8",
          fontStyle: "italic",
        },

        // ── Blockquote ─────────────────────────────────────────
        "& blockquote": {
          borderInlineStart: "2px solid #6366F1",
          margin: "0.85rem 0",
          padding: "0.5rem 0.85rem",
          backgroundColor: "rgba(99, 102, 241, 0.05)",
          borderRadius: "0 6px 6px 0",
          color: "#94A3B8",
          fontSize: "0.875rem",
          "& p": { marginBottom: 0 },
        },

        // ── Tables ─────────────────────────────────────────────
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          margin: "0.85rem 0",
          fontSize: "0.825rem",
          direction: "ltr",
          borderRadius: "6px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        },
        "& th": {
          backgroundColor: "#0C0F18",
          padding: "8px 12px",
          textAlign: isRtl ? "right" : "left",
          fontWeight: 600,
          fontSize: "0.78rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#E2E8F0",
        },
        "& td": {
          padding: "8px 12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
          color: "#94A3B8",
          textAlign: isRtl ? "right" : "left",
          verticalAlign: "top",
        },
        "& tr:last-child td": {
          borderBottom: "none",
        },
        "& tr:hover td": {
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        },

        // ── Inline code ────────────────────────────────────────
        "& code": {
          direction: "ltr",
          unicodeBidi: "embed",
          display: "inline",
          backgroundColor: "rgba(99, 102, 241, 0.08)",
          color: "#A5B4FC",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.84em",
          fontFamily: MONO_FONT,
          fontWeight: 500,
          wordBreak: "break-word",
        },

        // ── Code blocks ────────────────────────────────────────
        "& pre": {
          direction: "ltr",
          textAlign: "left",
          backgroundColor: "#07090F",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "8px",
          padding: "14px 16px",
          overflowX: "auto",
          margin: "0.85rem 0",
          "& code": {
            backgroundColor: "transparent",
            color: "#E2E8F0",
            padding: 0,
            fontSize: "0.825rem",
            lineHeight: 1.6,
            display: "block",
            direction: "ltr",
            textAlign: "left",
            fontFamily: MONO_FONT,
            fontWeight: 400,
            wordBreak: "normal",
          },
        },

        // ── HR ─────────────────────────────────────────────────
        "& hr": {
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          margin: "1.25rem 0",
        },

        // ── Links ──────────────────────────────────────────────
        "& a": {
          color: "#818CF8",
          textDecoration: "underline",
          textDecorationColor: "rgba(129, 140, 248, 0.3)",
          textUnderlineOffset: "2px",
          "&:hover": {
            color: "#A5B4FC",
          },
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  );
};
