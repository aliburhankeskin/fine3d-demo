import { Lato } from "next/font/google";
import { createTheme } from "@mui/material/styles";

export const customFont = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const getDefaultTheme = (mode: "dark" | "light") =>
  createTheme({
    ...(mode === "light"
      ? {
          palette: {
            mode: "light",
            primary: {
              main: "#7A9049",
            },
            secondary: {
              main: "#B2D0C9",
            },
            background: {
              default: "#FCFBFA",
              paper: "#F7F9FC",
            },
            error: {
              main: "#C81700",
              contrastText: "#fff",
            },
            card: {
              main: "#F9FAFC",
              contrastText: "#000",
            },
            card2: {
              main: "#F0F2F5",
              contrastText: "#000",
            },
          },
        }
      : {
          palette: {
            mode: "dark",
            primary: {
              main: "#7A9049",
            },
            secondary: {
              main: "#B2D0C9",
            },
            background: {
              default: "#060D12",
              paper: "#0A1929",
            },
            error: {
              main: "#C81700",
              contrastText: "#fff",
            },
            card: {
              main: "#0A1929",
              contrastText: "#fff",
            },
            card2: {
              main: "#0A1929",
              contrastText: "#fff",
            },
          },
        }),

    typography: {
      fontFamily: customFont.style.fontFamily,
    },
  });

declare module "@mui/material/styles" {
  interface Palette {
    card: Palette["primary"];
    card2: Palette["primary"];
  }

  interface PaletteOptions {
    card?: PaletteOptions["primary"];
    card2?: PaletteOptions["primary"];
  }
}
