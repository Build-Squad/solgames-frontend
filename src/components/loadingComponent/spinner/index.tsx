import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface SpinnerProps {
  size?: number;
  color?: "primary" | "secondary" | "inherit";
  thickness?: number;
  text?: string;
  textColor?: string;
  sx?: SxProps<Theme>;
  spinnerSx?: SxProps<Theme>;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "primary",
  thickness = 3.6,
  text = "",
  textColor = "#000",
  sx = {},
  spinnerSx = {},
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100%"
      width="100%"
      sx={{ ...sx }}
    >
      <CircularProgress
        size={size}
        color={color}
        thickness={thickness}
        sx={spinnerSx}
      />
      {text && (
        <Typography variant="body2" color={textColor} sx={{ marginTop: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;
