"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontSize: "0.78rem" }}
          >
            © {new Date().getFullYear()} {t("footerCopyright")}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#475569", fontSize: "0.75rem" }}
          >
            {t("footerNote")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
