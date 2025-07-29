"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FixedRightSideMenu from "./FixedRightSideMenu";

interface AppLayoutProps {
  drawer: React.ReactNode;
  children: React.ReactNode;
}

const drawerWidth = 400;

const AppLayout: React.FC<AppLayoutProps> = ({ drawer, children }) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("md"));
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Stack
      direction="row"
      sx={{ height: "100dvh", width: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          overflowY: "hidden",
          paddingRight: isSmUp ? `${60}px` : "0px",
          transition: "padding-right 0.3s ease",
        }}
      >
        {isMobile && (
          <AppBar sx={{ background: "white" }} elevation={0} position="static">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon color="primary" />
              </IconButton>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
          </AppBar>
        )}
        {children}
      </Box>

      <Drawer
        variant={isSmUp ? "permanent" : "temporary"}
        anchor="right"
        open={isSmUp}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderLeft: "1px solid #ddd",
            marginRight: "60px",
          },
        }}
      >
        {drawer}
      </Drawer>
      <FixedRightSideMenu />
    </Stack>
  );
};

export default AppLayout;
