import { IconButton, styled } from "@mui/material";

const OpsIconButton = styled(IconButton)(({ theme }) =>
  theme.palette.mode === "light"
    ? {
        borderRadius: "10px",
        backgroundColor: "rgba(249, 250, 252, 0.5)",
        color: theme.palette.primary.main,
        ":hover": {
          backgroundColor: "rgba(249, 250, 252, 0.5)",
          color: theme.palette.primary.dark,
        },
      }
    : {
        borderRadius: "10px",
      }
);

export default OpsIconButton;
