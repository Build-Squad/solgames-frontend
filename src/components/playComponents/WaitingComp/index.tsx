import React from "react";
import { motion } from "framer-motion";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import White_Queen from "@/assets/Pieces/White_Queen.svg";
import Black_Pawn from "@/assets/Pieces/Black_Pawn.svg";
import { Button } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const pieceImages = {
  wq: White_Queen,
  bp: Black_Pawn,
};

const WaitingForPlayer = ({ isGameStarted }) => {
  const router = useRouter();
  if (isGameStarted) return null;

  const handleExit = () => {
    router.back();
  };

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: 1301,
        backdropFilter: "blur(10px)", // Blurred background
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
      }}
      open={!isGameStarted}
    >
      <motion.div
        style={{ position: "absolute", width: "100%", height: "100vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Exit Button */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 3,
          }}
        >
          <Button
            startIcon={<ExitToApp />}
            onClick={handleExit}
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
            Exit
          </Button>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh",
            position: "relative",
          }}
        >
          {/* Subtle Glow Effect */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(92,92,92,0.5) 0%, rgba(0,0,0,0) 70%)", // Adjusting glow to match dark font theme
              transform: "translate(-50%, -50%)",
              zIndex: -1,
            }}
          />

          {/* Queen Image with Pulse */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
          >
            <Image
              src={pieceImages.wq}
              alt="White Queen"
              width={100}
              height={100}
              style={{
                filter: "drop-shadow(0px 0px 20px rgba(92, 92, 92, 0.8))", // Subtle dark glow around the queen
              }}
            />
          </motion.div>

          {/* Bold "Waiting for Opponent" Message */}
          <Typography
            variant="h4"
            sx={{
              mt: 4,
              fontWeight: "bold",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textAlign: "center",
              color: "#e0e0e0", // Lighter grey color for the text
              textShadow: "0 0 12px rgba(92, 92, 92, 0.7)", // Darker shadow to match the dark theme
            }}
          >
            Waiting for the opponent...
          </Typography>

          {/* Dynamic Subheading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mt: 3,
                textAlign: "center",
                fontStyle: "italic",
                color: "#aaaaaa", // Darker, muted color for the subtext
                textShadow: "0 0 10px rgba(92, 92, 92, 0.9)", // Darker shadow to match the theme
              }}
            >
              Hold tight! Your opponent will arrive soon...
            </Typography>
          </motion.div>

          {/* Black Pawn Image with Pulse */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            style={{ marginTop: "50px" }}
          >
            <Image
              src={pieceImages.bp}
              alt="Black Pawn"
              width={80}
              height={80}
              style={{
                filter: "drop-shadow(0px 0px 20px rgba(92, 92, 92, 0.8))", // Subtle dark glow around the pawn
              }}
            />
          </motion.div>
        </Box>
      </motion.div>
    </Backdrop>
  );
};

export default WaitingForPlayer;
