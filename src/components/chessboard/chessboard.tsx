"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import { Chess, Square as ChessSquare } from "chess.js";
import Image from "next/image";
import styles from "./chessboard.module.css";
import Black_Bishop from "@/assets/Pieces/Black_Bishop.svg";
import Black_King from "@/assets/Pieces/Black_King.svg";
import Black_Knight from "@/assets/Pieces/Black_Knight.svg";
import Black_Pawn from "@/assets/Pieces/Black_Pawn.svg";
import Black_Queen from "@/assets/Pieces/Black_Queen.svg";
import Black_Rook from "@/assets/Pieces/Black_Rook.svg";
import White_Bishop from "@/assets/Pieces/White_Bishop.svg";
import White_King from "@/assets/Pieces/White_King.svg";
import White_Knight from "@/assets/Pieces/White_Knight.svg";
import White_Pawn from "@/assets/Pieces/White_Pawn.svg";
import White_Queen from "@/assets/Pieces/White_Queen.svg";
import White_Rook from "@/assets/Pieces/White_Rook.svg";

// White small letter, Black big letter
const pieceImages: { [key: string]: string } = {
  P: Black_Pawn,
  p: White_Pawn,
  N: Black_Knight,
  n: White_Knight,
  B: Black_Bishop,
  b: White_Bishop,
  R: Black_Rook,
  r: White_Rook,
  Q: Black_Queen,
  q: White_Queen,
  K: Black_King,
  k: White_King,
};

const getBorderRadiusClass = (index: number) => {
  switch (index) {
    case 0:
      return styles.borderTopLeft;
    case 7:
      return styles.borderTopRight;
    case 56:
      return styles.borderBottomLeft;
    case 63:
      return styles.borderBottomRight;
    default:
      return "";
  }
};

const Chessboard: React.FC = () => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [chess] = useState(new Chess());
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(64).fill(null)
  );
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  // This will store square index as "a8" | "b8" | "c8" | "d8" |...
  const [possibleMoves, setPossibleMoves] = useState<ChessSquare[]>([]);
  const [turn, setTurn] = useState<"w" | "b">("w");

  const [shake, setShake] = useState(false);

  const handleShakeScreen = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500); // Shake duration should match the animation duration
  };

  const updateBoard = useCallback(() => {
    const newSquares = Array(64).fill(null);
    chess.board().forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece) {
          const pieceSymbol =
            piece.color === "w"
              ? piece.type.toUpperCase()
              : piece.type.toLowerCase();
          newSquares[rowIndex * 8 + colIndex] = pieceSymbol;
        }
      });
    });
    setSquares(newSquares);
  }, [chess]);

  useEffect(() => {
    updateBoard();
  }, [updateBoard]);

  const handleSquareClick = (index: number) => {
    const fromSquare = indexToSquare(index);
    const piece = chess.get(fromSquare);

    // Check if a piece exists on the clicked square and if it's the turn of the correct color
    if (piece && piece.color !== chess.turn()) {
      handleShakeScreen();
      setSnackbarMessage("Not your turn!");
      return;
    }

    if (selectedSquare === null) {
      const fromSquare = indexToSquare(index);
      const piece = chess.get(fromSquare);

      // Check if a piece exists on the clicked square
      if (!piece) {
        handleShakeScreen();
        setSnackbarMessage("No piece selected!");
        return;
      }

      setSelectedSquare(index);

      // Setting possible moves
      const from = indexToSquare(index);
      const moves = chess
        .moves({ square: from, verbose: true })
        .map((move) => move.to);
      setPossibleMoves(moves);
    } else {
      try {
        // Making the move
        const from = indexToSquare(selectedSquare);
        const to = indexToSquare(index);
        const move = chess.move({ from, to });
        if (move) {
          setTurn(chess.turn());
          updateBoard();
        }
        setSelectedSquare(null);
        setPossibleMoves([]);
      } catch (e) {
        handleShakeScreen();
        setSnackbarMessage("Not a valid move!");
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
  };

  const indexToSquare = (index: number): ChessSquare => {
    const file = String.fromCharCode(97 + (index % 8));
    const rank = 8 - Math.floor(index / 8);
    return `${file}${rank}` as ChessSquare;
  };

  const handleClose = () => {
    setSnackbarMessage("");
  };

  return (
    <>
      <Box className={styles.boardContainer}>
        <Box className={`${styles.board} ${shake ? styles.shake : ""}`}>
          {shake && <Box className={styles.errorBox} />}
          {squares.map((piece, index) => (
            <Box
              key={index}
              className={`${styles.square} ${
                (Math.floor(index / 8) + (index % 8)) % 2 === 0
                  ? styles.white
                  : styles.black
              } ${getBorderRadiusClass(index)}`}
              onClick={() => handleSquareClick(index)}
              sx={{
                backgroundColor:
                  selectedSquare == index ? "#FF5C00 !important" : "inherit",
              }}
            >
              {piece && (
                <Image
                  src={pieceImages[piece]}
                  alt={piece}
                  className={styles.piece}
                />
              )}
              {possibleMoves.includes(indexToSquare(index)) && (
                <Box className={styles.possibleMove} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Chessboard;
