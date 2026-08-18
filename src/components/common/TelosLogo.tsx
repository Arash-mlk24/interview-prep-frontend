"use client";

import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import Image from "next/image";

interface TelosLogoProps {
  size?: number;
  sx?: SxProps<Theme>;
}

export const TelosLogo: React.FC<TelosLogoProps> = ({ size = 32, sx }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "8px",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        backgroundColor: "#090A0F",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 0 12px -2px rgba(99, 102, 241, 0.3)"
            : "0 2px 8px -1px rgba(0, 0, 0, 0.1)",
        ...sx,
      }}
    >
      <Image
        src="/images/telos-apex-logo.jpg"
        alt="Telos Logo"
        width={size}
        height={size}
        unoptimized
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>
  );
};
