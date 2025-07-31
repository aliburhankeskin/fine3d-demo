"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@redux/hooks";
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
import { setDrawerOpen } from "@/redux/appSlice";

interface AppLayoutProps {
  drawer: React.ReactNode;
  children: React.ReactNode;
}

const drawerWidth = 400;

const AppLayout: React.FC<AppLayoutProps> = ({ drawer, children }) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("md"));
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const drawerOpen = useAppSelector((state) => state.AppReducer.drawerOpen);

  const handleDrawerToggle = () => {
    dispatch(setDrawerOpen(!drawerOpen));
  };

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
          <AppBar sx={{ background: "transparent" }} elevation={0}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ padding: "0 16px" }}
            >
              <Image
                src="/logo-big.svg"
                alt="Logo"
                width={50}
                height={50}
                priority
              />
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon color="inherit" />
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
        open={isSmUp && drawerOpen}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth, // Sabit genişlik
            boxSizing: "border-box",
            borderLeft: "1px solid #ddd",
            marginRight: "60px", // FixedRightSideMenu için her zaman 60px
            overflow: "hidden",
            transform: drawerOpen
              ? "translateX(0)"
              : `translateX(${drawerWidth}px)`, // Smooth slide animation
            transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smooth easing
            visibility: drawerOpen ? "visible" : "hidden", // Kapalıyken görünmez
          },
        }}
      >
        {drawer}
      </Drawer>
      <FixedRightSideMenu onMenuToggle={handleDrawerToggle} />
    </Stack>
  );
};

export default AppLayout;
