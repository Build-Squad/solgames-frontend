import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const DotsLoader: React.FC<{ text?: string }> = ({ text = "" }) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 5 ? prev + "." : "."));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {text}
        {dots}
      </Typography>
    </Box>
  );
};

export default DotsLoader;
