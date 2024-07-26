import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

interface NoDataFoundProps {
  message?: string;
  onRetry?: () => void;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ message, onRetry }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <SearchOffIcon sx={{ fontSize: 80, color: "white" }} />
      <Typography
        variant="h5"
        sx={{ marginTop: 2, color: "white", fontWeight: "bold" }}
      >
        {message || "No Data Found"}
      </Typography>
      {onRetry && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onRetry}
          sx={{ marginTop: 2 }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};

export default NoDataFound;
