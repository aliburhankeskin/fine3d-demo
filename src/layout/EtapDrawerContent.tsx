"use client";
import React from "react";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface EtapDrawerContentProps {
  blokSayisi: number;
  daireSayisi: number;
}

const EtapDrawerContent: React.FC<EtapDrawerContentProps> = ({
  blokSayisi,
  daireSayisi,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#fff",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography fontSize={18} fontWeight={600}>
          Etap Görünümü
        </Typography>
        <IconButton size="small">
          <FavoriteBorderIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      <Stack spacing={1}>
        <DrawerInfoRow label="Blok Sayısı" value={`${blokSayisi} Blok`} />
        <DrawerInfoRow label="Daire Sayısı" value={`${daireSayisi} daire`} />
      </Stack>
    </Box>
  );
};

const DrawerInfoRow = ({ label, value }: { label: string; value: string }) => (
  <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography fontSize={14} color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={14} fontWeight={600}>
        {value}
      </Typography>
    </Box>
    <Divider
      sx={{
        borderStyle: "dashed",
      }}
    />
  </>
);

export default EtapDrawerContent;
