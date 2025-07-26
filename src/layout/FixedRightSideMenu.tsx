import React from "react";
import Image from "next/image";
import { Box, IconButton, Stack } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";

const FixedRightSideMenu = () => {
  return (
    <Stack
      direction="column"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 60,
        height: "100dvh",
        py: 2,
        boxShadow: 2,
        bgcolor: "card2.main",
        display: { xs: "none", md: "flex" },
        zIndex: (theme) => theme.zIndex.appBar + 2, // Drawer'dan üstte dursun
      }}
    >
      <Stack spacing={2} alignItems="center">
        <IconButton>
          <MenuIcon color="primary" />
        </IconButton>
        <IconButton>
          <HomeIcon color="primary" />
        </IconButton>
        <IconButton>
          <FavoriteIcon color="primary" />
        </IconButton>
        <IconButton>
          <LocationOnIcon color="primary" />
        </IconButton>
      </Stack>

      <Image src="/logo-big.svg" alt="Logo" width={40} height={40} priority />
    </Stack>
  );
};

export default FixedRightSideMenu;
