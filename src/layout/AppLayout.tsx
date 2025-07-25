"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FixedRightSideMenu from "./FixedRightSideMenu";

interface AppLayoutProps {
  drawer: React.ReactNode;
  children: React.ReactNode;
}

const drawerWidth = 320;

const AppLayout: React.FC<AppLayoutProps> = ({ drawer, children }) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Stack
      direction="row"
      sx={{ height: "100dvh", width: "100%", overflow: "hidden" }}
    >
      <Box sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>
        {!isSmUp && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ position: "absolute", top: 16, left: 16, zIndex: 1100 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {children}
      </Box>

      <Drawer
        variant={isSmUp ? "permanent" : "temporary"}
        anchor="right"
        open={isSmUp || mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderLeft: "1px solid #ddd",
            marginRight: "60px", // FixedRightSideMenu kadar sağdan boşluk
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
