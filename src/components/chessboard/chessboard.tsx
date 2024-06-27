"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { Chess, Square as ChessSquare } from "chess.js";
import PlayerComp from "@/components/playerComp";
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
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { GAME_CODE } from "@/utils/constants";
import { useSearchParams } from "next/navigation";

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

const indexToSquare = (index: number): ChessSquare => {
  const file = String.fromCharCode(97 + (index % 8));
  const rank = 8 - Math.floor(index / 8);
  return `${file}${rank}` as ChessSquare;
};

const Chessboard: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const inviteCode = searchParams.get("inviteCode");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [chess, setChess] = useState(new Chess());
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(64).fill(null)
  );
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<ChessSquare[]>([]);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [shake, setShake] = useState(false);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState<string[]>([]);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      if (inviteCode) {
        socket.emit("joinGame", inviteCode);
      } else {
        socket.emit("createGame", GAME_CODE);
      }
    }
  }, [socket]);

  const updateBoard = useCallback((chessInstance: Chess) => {
    const newSquares = Array(64).fill(null);
    chessInstance.board().forEach((row, rowIndex) => {
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
  }, []);

  const handleShakeScreen = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 1000);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("gameCreated", (game: any) => {
        setGameId(game.id);
        const newChess = new Chess(game.chess);
        setChess(newChess);
        updateBoard(newChess);
        const player = game.players.find(
          (player: any) => player.id === socket.id
        );
        setPlayerColor(player.color);
      });

      socket.on("playerJoined", (game: any) => {
        setGameId(game.id);
        const newChess = new Chess(game.chess);
        setChess(newChess);
        updateBoard(newChess);
        const player = game.players.find(
          (player: any) => player.id === socket.id
        );
        setPlayerColor(player.color);
      });

      socket.on("moveMade", (game: any) => {
        const newChess = new Chess(game.chess);
        setChess(newChess);
        updateBoard(newChess);
        setTurn(game.turn);
        setCapturedWhitePieces(game.capturedWhitePieces);
        setCapturedBlackPieces(game.capturedBlackPieces);
      });

      socket.on("error", (message) => {
        handleShakeScreen();
        setSnackbarMessage(message?.errorMessage || message);
        setTimeout(() => {
          if (message?.event == "createGame") {
            router.push("/");
          }
        }, 1300);
      });
    }
  }, [socket, updateBoard, handleShakeScreen]);

  const handleSquareSelection = (index: number) => {
    const fromSquare = indexToSquare(index);
    const piece = chess.get(fromSquare);

    if (!piece) {
      handleShakeScreen();
      setSnackbarMessage("No piece selected!");
      return;
    }

    setSelectedSquare(index);
    setPossibleMoves(
      chess.moves({ square: fromSquare, verbose: true }).map((move) => move.to)
    );
  };

  const handleMove = (index: number) => {
    const from = indexToSquare(selectedSquare!);
    const to = indexToSquare(index);
    const move = { from, to };
    socket?.emit("makeMove", { gameId, move });
  };

  const handleSquareClick = useCallback(
    (index: number) => {
      const fromSquare = indexToSquare(index);
      const piece = chess.get(fromSquare);

      if (selectedSquare === null) {
        // First selection, must select a piece of the current player's turn
        if (
          piece &&
          piece.color === chess.turn() &&
          piece.color === playerColor
        ) {
          handleSquareSelection(index);
        } else {
          handleShakeScreen();
          setSnackbarMessage("Select a valid piece!");
        }
      } else {
        // If selecting another piece of the current player's color
        if (
          piece &&
          piece.color === chess.turn() &&
          piece.color === playerColor
        ) {
          handleSquareSelection(index);
          return;
        }
        // Second selection, must be a valid move
        handleMove(index);
      }
    },
    [chess, selectedSquare, handleMove, handleShakeScreen, playerColor]
  );

  useEffect(() => {
    updateBoard(chess);
  }, [updateBoard, chess]);

  const handleCloseSnackbar = () => setSnackbarMessage("");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box className={styles.boardContainer}>
          {/* The white player box */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "0",
              transform: "translateX(-100%)",
            }}
          >
            <PlayerComp
              isActive={false}
              alignDirection={"right"}
              title="Sanjay Meena"
              rank={"Master"}
              pieces={[
                ...capturedBlackPieces.map(
                  (piece) => pieceImages[piece.toUpperCase()]
                ),
              ]}
            />
          </Box>

          {/* The black player box */}
          <Box
            sx={{
              position: "absolute",
              bottom: "10%",
              right: "0",
              transform: "translateX(100%)",
            }}
          >
            <PlayerComp
              isActive={true}
              alignDirection={"left"}
              title="Parikshit Singh"
              rank={"Junior"}
              pieces={[
                ...capturedWhitePieces.map(
                  (piece) => pieceImages[piece.toLowerCase()]
                ),
              ]}
            />
          </Box>
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
                    selectedSquare === index ? "#FF5C00 !important" : "inherit",
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
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      <Box
        sx={{
          mt: 5,
          padding: "10px 20px",
          backgroundColor: playerColor == "w" ? "black" : "white",
          color: playerColor == "w" ? "white" : "black",
          textAlign: "center",
        }}
      >
        <Typography variant="h3">
          You are {playerColor == "w" ? "White Player" : "Black Player"}
        </Typography>
      </Box>
    </>
  );
};

export default Chessboard;
