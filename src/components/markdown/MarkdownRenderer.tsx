"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

interface MarkdownRendererProps {
  content: string;
}

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { isRtl } = useLanguage();

  return (
    <Box
      className="markdown-body"
      dir={isRtl ? "rtl" : "ltr"}
      sx={{
        color: "#CBD5E1",
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
          color: "#F8FAFC",
          letterSpacing: isRtl ? "0" : "-0.015em",
          "&:first-of-type": { marginTop: "0.25rem" },
        },
        "& h1": {
          fontSize: { xs: "1.2rem", md: "1.45rem" },
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "0.6rem",
        },
        "& h2": {
          fontSize: { xs: "1.08rem", md: "1.25rem" },
          color: "#F1F5F9",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          paddingBottom: "0.45rem",
        },
        "& h3": {
          fontSize: { xs: "0.98rem", md: "1.1rem" },
          color: "#818CF8",
        },
        "& h4": {
          fontSize: { xs: "0.9rem", md: "0.98rem" },
          color: "#38BDF8",
          fontWeight: 600,
        },
        "& h5, & h6": {
          fontSize: "0.85rem",
          color: "#94A3B8",
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
            color: "#818CF8",
          },
        },
        "& li > ul, & li > ol": {
          marginBottom: 0,
          marginTop: "0.35rem",
        },

        // ── Strong / Em ────────────────────────────────────────
        "& strong": {
          color: "#F8FAFC",
          fontWeight: 700,
        },
        "& em": {
          color: "#A5B4FC",
          fontStyle: "italic",
        },

        // ── Blockquote ─────────────────────────────────────────
        "& blockquote": {
          borderInlineStart: "3px solid #6366F1",
          margin: "1.6rem 0",
          padding: "0.9rem 1.35rem",
          backgroundColor: "rgba(99, 102, 241, 0.06)",
          borderRadius: isRtl ? "8px 0 0 8px" : "0 8px 8px 0",
          color: "#CBD5E1",
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
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "#0B0E17",
        },
        "& th": {
          backgroundColor: "#111625",
          padding: "12px 16px",
          fontWeight: 700,
          fontSize: "0.76rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#F8FAFC",
        },
        "& td": {
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          color: "#CBD5E1",
          verticalAlign: "top",
          lineHeight: 1.6,
        },
        "& tr:last-child td": {
          borderBottom: "none",
        },
        "& tr:hover td": {
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        },

        // ── Inline code ────────────────────────────────────────
        "& :not(pre) > code": {
          direction: "ltr !important",
          unicodeBidi: "isolate",
          display: "inline-block",
          backgroundColor: "rgba(99, 102, 241, 0.12)",
          color: "#A5B4FC",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          padding: "1px 7px",
          margin: "0 2px",
          borderRadius: "5px",
          fontSize: "0.82em",
          fontFamily: MONO_FONT,
          fontWeight: 500,
          verticalAlign: "middle",
        },

        // ── Code blocks (Strictly LTR in ALL modes) ─────────────
        "& pre": {
          direction: "ltr !important",
          textAlign: "left !important",
          unicodeBidi: "isolate !important",
          backgroundColor: "#06080F !important",
          border: "1px solid rgba(255, 255, 255, 0.09) !important",
          borderRadius: "10px !important",
          padding: { xs: "16px 18px", md: "20px 24px" },
          overflowX: "auto !important",
          margin: "1.6rem 0 !important",
          boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.5) !important",
          "& code": {
            backgroundColor: "transparent !important",
            color: "#E2E8F0 !important",
            padding: "0 !important",
            fontSize: "0.78rem !important",
            lineHeight: "1.7 !important",
            display: "block !important",
            direction: "ltr !important",
            textAlign: "left !important",
            unicodeBidi: "isolate !important",
            fontFamily: `${MONO_FONT} !important`,
            fontWeight: "400 !important",
            tabSize: 4,
            whiteSpace: "pre !important",
          },
        },

        // ── Horizontal Rule ────────────────────────────────────
        "& hr": {
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          margin: "2.5rem 0",
        },

        // ── Links ──────────────────────────────────────────────
        "& a": {
          color: "#818CF8",
          textDecoration: "underline",
          textDecorationColor: "rgba(129, 140, 248, 0.35)",
          textUnderlineOffset: "3px",
          "&:hover": {
            color: "#A5B4FC",
            textDecorationColor: "#A5B4FC",
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
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  unicodeBidi: "isolate",
                  fontFamily: MONO_FONT,
                }}
                className={className}
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
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
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
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};
