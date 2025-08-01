"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@redux/hooks";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getDefaultTheme } from "@/assets/theme/theme";

export default function CustomThemeProvider({ children }: any) {
  const themeMode = useAppSelector((state) => state.AppReducer.theme);

  const getTheme = useCallback(() => {
    return themeMode;
  }, [themeMode]);

  const muiTheme = useMemo(
    () => getDefaultTheme(getTheme() as any),
    [getTheme]
  );

  useEffect(() => {
    try {
      const themeColor = getTheme() === "dark" ? "#060D12" : "#ffffff";
      let meta = document.querySelector('meta[name="theme-color"]');

      if (!meta) {
        meta = document.createElement("meta");
        (meta as HTMLMetaElement).name = "theme-color";
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", themeColor);
    } catch (error) {}
  }, [getTheme, themeMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={(theme) => ({
          "::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#C6C6C6",
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.background.default,
          },
        })}
      />
      {children}
    </ThemeProvider>
  );
}
