"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  InputBase,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../../context/LanguageContext";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  variant?: "default" | "hero" | "compact";
  fullWidth?: boolean;
  maxWidth?: number | string;
  showShortcut?: boolean;
  autoFocus?: boolean;
  id?: string;
  sx?: SxProps<Theme>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  onClear,
  variant = "default",
  fullWidth = true,
  maxWidth,
  showShortcut = true,
  autoFocus = false,
  id,
  sx,
}) => {
  const { isRtl } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Global hotkey: press '/' or 'Cmd/Ctrl + K' to focus this search input
  useEffect(() => {
    if (!showShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.key === "/" && !isInput) || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (value) {
          onChange("");
          onClear?.();
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcut, value, onChange, onClear]);

  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  const height = isHero ? 46 : isCompact ? 34 : 38;
  const borderRadius = isHero ? 12 : 8;
  const fontSize = isHero ? "0.9rem" : "0.825rem";
  const iconSize = isHero ? 20 : 17;

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        maxWidth: maxWidth ?? (isHero ? 520 : 360),
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? isFocused
                ? "rgba(18, 22, 36, 0.95)"
                : isHero
                ? "rgba(15, 18, 28, 0.85)"
                : "rgba(12, 15, 24, 0.7)"
              : isFocused
              ? "#FFFFFF"
              : isHero
              ? "#FFFFFF"
              : "rgba(241, 245, 249, 0.8)",
          border: "1px solid",
          borderColor: (theme) =>
            isFocused
              ? "primary.main"
              : theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.12)",
          borderRadius: `${borderRadius}px`,
          px: isHero ? 1.75 : 1.25,
          gap: 1,
          boxShadow: (theme) =>
            isFocused
              ? theme.palette.mode === "dark"
                ? "0 0 0 3px rgba(99, 102, 241, 0.15), 0 4px 16px -4px rgba(0, 0, 0, 0.5)"
                : "0 0 0 3px rgba(79, 70, 229, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)"
              : theme.palette.mode === "dark"
              ? "0 2px 8px -2px rgba(0, 0, 0, 0.3)"
              : "0 2px 8px -2px rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(12px)",
          transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: (theme) =>
              isFocused
                ? "primary.main"
                : theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.16)"
                : "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {/* Leading Search Icon */}
        <SearchIcon
          sx={{
            fontSize: iconSize,
            color: isFocused ? "primary.main" : "text.secondary",
            flexShrink: 0,
            transition: "color 0.15s ease",
          }}
        />

        {/* Input Base */}
        <InputBase
          id={id}
          inputRef={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            flexGrow: 1,
            color: "text.primary",
            fontSize,
            fontFamily: "inherit",
            "& .MuiInputBase-input": {
              p: 0,
            },
          }}
        />

        {/* Trailing Controls: Clear Button & Shortcut Hint */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
          {value ? (
            <IconButton
              size="small"
              onClick={handleClear}
              aria-label="Clear search"
              sx={{
                p: 0.35,
                color: "text.secondary",
                borderRadius: "50%",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  color: "text.primary",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 13 }} />
            </IconButton>
          ) : showShortcut ? (
            <Box
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                minWidth: 20,
                px: 0.6,
                borderRadius: "4px",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.04)",
                border: "1px solid",
                borderColor: "divider",
                color: "text.secondary",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                userSelect: "none",
                lineHeight: 1,
              }}
            >
              {isFocused ? "Esc" : "/"}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
