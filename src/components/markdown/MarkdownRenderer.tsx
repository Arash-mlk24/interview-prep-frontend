"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

interface MarkdownRendererProps {
  content: string;
}

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/**
 * Pre-processes markdown content to clean up raw LaTeX math syntax
 * (e.g. $O(1)$, $O(N)$, $\le$, $\ge$, $\dots$) into clean markdown / inline code.
 */
function cleanMathNotation(text: string): string {
  if (!text) return "";
  return text
    // Replace $O(...) $ with `O(...)`
    .replace(/\$O\(([^$]+)\)\$/g, "`O($1)`")
    // Replace $\le$ with <=
    .replace(/\$\\le\$/g, "<=")
    .replace(/\\le\b/g, "<=")
    // Replace $\ge$ with >=
    .replace(/\$\\ge\$/g, ">=")
    .replace(/\\ge\b/g, ">=")
    // Replace $\dots$ with ...
    .replace(/\$\\dots\$/g, "...")
    .replace(/\\dots\b/g, "...")
    // Replace $\approx$ with ~
    .replace(/\$\\approx\$/g, "~")
    // Replace $\pm$ with ±
    .replace(/\$\\pm\$/g, "±")
    // Replace $\times$ with ×
    .replace(/\$\\times\$/g, "×")
    .replace(/\\times\b/g, "×")
    // Replace $\le 16$ or similar expressions
    .replace(/\$\\le\s*([0-9]+)\$/g, "<= $1")
    .replace(/\$\\ge\s*([0-9]+)\$/g, ">= $1")
    // Replace clean $50,000+$ or variable like $N$ or $K$ with normal text
    .replace(/\$([A-Za-z0-9_+\-/*<>=,\s]+)\$/g, "$1");
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { isRtl } = useLanguage();
  const cleanedContent = useMemo(() => cleanMathNotation(content), [content]);

  return (
    <Box
      className="markdown-body"
      dir={isRtl ? "rtl" : "ltr"}
      sx={{
        color: (theme) =>
          theme.palette.mode === "dark" ? "#CBD5E1" : "#334155",
        fontSize: { xs: "0.85rem", md: "0.9rem" },
        lineHeight: isRtl ? 1.95 : 1.85,

        // ── Paragraphs ─────────────────────────────────────────
        "& p": {
          marginTop: 0,
          marginBottom: "1.4rem",
          "&:last-child": { marginBottom: 0 },
        },

        // ── Headings ───────────────────────────────────────────
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          fontWeight: 700,
          marginTop: "2.5rem",
          marginBottom: "1rem",
          lineHeight: 1.45,
          color: (theme) =>
            theme.palette.mode === "dark" ? "#F8FAFC" : "#0F172A",
          letterSpacing: isRtl ? "0" : "-0.015em",
          "&:first-of-type": { marginTop: "0.25rem" },
        },
        "& h1": {
          fontSize: { xs: "1.2rem", md: "1.45rem" },
          borderBottom: "1px solid",
          borderColor: "divider",
          paddingBottom: "0.6rem",
        },
        "& h2": {
          fontSize: { xs: "1.08rem", md: "1.25rem" },
          color: (theme) =>
            theme.palette.mode === "dark" ? "#F1F5F9" : "#1E293B",
          borderBottom: "1px solid",
          borderColor: "divider",
          paddingBottom: "0.45rem",
        },
        "& h3": {
          fontSize: { xs: "0.98rem", md: "1.1rem" },
          color: "primary.main",
        },
        "& h4": {
          fontSize: { xs: "0.9rem", md: "0.98rem" },
          color: "secondary.main",
          fontWeight: 600,
        },
        "& h5, & h6": {
          fontSize: "0.85rem",
          color: "text.secondary",
          fontWeight: 600,
        },

        // ── Lists ──────────────────────────────────────────────
        "& ul, & ol": {
          paddingInlineStart: "1.85rem",
          paddingInlineEnd: "0",
          marginTop: "0.5rem",
          marginBottom: "1.4rem",
        },
        "& li": {
          marginBottom: "0.6rem",
          lineHeight: isRtl ? 1.9 : 1.8,
          "&::marker": {
            color: "primary.main",
          },
        },
        "& li > ul, & li > ol": {
          marginBottom: 0,
          marginTop: "0.35rem",
        },

        // ── Strong / Em ────────────────────────────────────────
        "& strong": {
          color: (theme) =>
            theme.palette.mode === "dark" ? "#F8FAFC" : "#0F172A",
          fontWeight: 700,
        },
        "& em": {
          color: (theme) =>
            theme.palette.mode === "dark" ? "#A5B4FC" : "#4338CA",
          fontStyle: "italic",
        },

        // ── Blockquote ─────────────────────────────────────────
        "& blockquote": {
          borderInlineStart: "3px solid",
          borderColor: "primary.main",
          margin: "1.6rem 0",
          padding: "0.9rem 1.35rem",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(99, 102, 241, 0.08)"
              : "rgba(79, 70, 229, 0.06)",
          borderRadius: isRtl ? "8px 0 0 8px" : "0 8px 8px 0",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#CBD5E1" : "#334155",
          fontSize: "0.85rem",
          lineHeight: isRtl ? 1.85 : 1.75,
          "& p": { marginBottom: 0 },
        },

        // ── Tables ─────────────────────────────────────────────
        "& table": {
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          margin: "1.85rem 0",
          fontSize: "0.8rem",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        },
        "& th": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#111625" : "#F1F5F9",
          padding: "12px 16px",
          fontWeight: 700,
          fontSize: "0.76rem",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#F8FAFC" : "#0F172A",
        },
        "& td": {
          padding: "12px 16px",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#CBD5E1" : "#334155",
          verticalAlign: "top",
          lineHeight: 1.6,
        },
        "& tr:last-child td": {
          borderBottom: "none",
        },
        "& tr:hover td": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(0, 0, 0, 0.02)",
        },

        // ── Inline code ────────────────────────────────────────
        "& :not(pre) > code": {
          display: "inline-block",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(99, 102, 241, 0.14)"
              : "rgba(79, 70, 229, 0.08)",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#A5B4FC" : "#4338CA",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(99, 102, 241, 0.25)"
              : "rgba(79, 70, 229, 0.2)",
          padding: "1px 7px",
          margin: "0 2px",
          borderRadius: "5px",
          fontSize: "0.82em",
          fontFamily: MONO_FONT,
          fontWeight: 500,
          verticalAlign: "middle",
        },

        // ── Code blocks container ──────────────────────────────
        "& pre": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#06080F" : "#0F172A",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.09)"
              : "rgba(0, 0, 0, 0.12)",
          borderRadius: "10px",
          padding: { xs: "16px 18px", md: "20px 24px" },
          overflowX: "auto",
          margin: "1.6rem 0",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "inset 0 1px 3px rgba(0, 0, 0, 0.5)"
              : "0 2px 10px -2px rgba(0, 0, 0, 0.12)",
          "& code": {
            backgroundColor: "transparent",
            color: "#F8FAFC",
            padding: 0,
            fontSize: "0.78rem",
            lineHeight: "1.7",
            fontFamily: MONO_FONT,
            fontWeight: 400,
            tabSize: 4,
          },
        },

        // ── Horizontal Rule ────────────────────────────────────
        "& hr": {
          border: "none",
          borderTop: "1px solid",
          borderColor: "divider",
          margin: "2.5rem 0",
        },

        // ── Links ──────────────────────────────────────────────
        "& a": {
          color: "primary.main",
          textDecoration: "underline",
          textDecorationColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(129, 140, 248, 0.35)"
              : "rgba(79, 70, 229, 0.35)",
          textUnderlineOffset: "3px",
          "&:hover": {
            color: (theme) =>
              theme.palette.mode === "dark" ? "#A5B4FC" : "#3730A3",
            textDecorationColor: "currentColor",
          },
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ node, ...props }) => (
            <pre
              dir="ltr"
              lang="en"
              className="notranslate"
              style={{
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "isolate",
                fontFamily: MONO_FONT,
              }}
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }: any) => {
            return (
              <code
                dir="ltr"
                lang="en"
                className={`notranslate ${className || ""}`}
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  unicodeBidi: "isolate",
                  fontFamily: MONO_FONT,
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <Box
              component="span"
              sx={{
                display: "block",
                my: 3.5,
                textAlign: "center",
                direction: "ltr",
              }}
            >
              <Box
                component="img"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(0, 0, 0, 0.1)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 8px 30px rgba(0, 0, 0, 0.5)"
                      : "0 8px 30px rgba(0, 0, 0, 0.08)",
                  display: "inline-block",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                  },
                }}
                {...props}
              />
            </Box>
          ),
          table: ({ node, ...props }: any) => (
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table
                dir={isRtl ? "rtl" : "ltr"}
                style={{
                  direction: isRtl ? "rtl" : "ltr",
                  textAlign: isRtl ? "right" : "left",
                }}
                {...props}
              />
            </div>
          ),
          th: ({ node, style, ...props }: any) => (
            <th
              dir={isRtl ? "rtl" : "ltr"}
              style={{
                ...style,
                direction: isRtl ? "rtl" : "ltr",
                textAlign: isRtl ? "right" : "left",
              }}
              {...props}
            />
          ),
          td: ({ node, style, ...props }: any) => (
            <td
              dir={isRtl ? "rtl" : "ltr"}
              style={{
                ...style,
                direction: isRtl ? "rtl" : "ltr",
                textAlign: isRtl ? "right" : "left",
              }}
              {...props}
            />
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </Box>
  );
};
