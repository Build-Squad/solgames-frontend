import SurrenderModal from "@/components/modals/surrenderModal";
import { Info } from "@mui/icons-material";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { useState } from "react";

const SurrenderBox = ({ timeoutCount, onSurrender }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "transparent",
        paddingX: "calc(5% + 12px)",
      }}
    >
      {/* Ideal Count Box */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          backgroundColor: "#333",
          textAlign: "center",
          fontSize: "20px",
          padding: "10px 40px",
          borderRadius: "8px",
          color: "white",
          textTransform: "capitalize",
        }}
      >
        <Typography>Ideal count - {timeoutCount}/3</Typography>
        <Tooltip title="More than 3 ideal count will result in your defeat">
          <Info sx={{ fontSize: "14px", cursor: "pointer" }} />
        </Tooltip>
      </Box>

      {/* Surrender Button */}
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          backgroundColor: "#f44336",
          color: "white",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#d32f2f",
          },
        }}
      >
        Surrender
      </Button>

      {/* Surrender modal */}
      <SurrenderModal
        onClose={() => setOpenModal(false)}
        open={openModal}
        handleSurrender={onSurrender}
      />
    </Box>
  );
};

export default SurrenderBox;
