"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
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
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/context/socketContext";
import { ContentCopy } from "@mui/icons-material";
import FinalModal from "../modals/finalModal";
import { useGetGameWithInviteCode } from "@/hooks/api-hooks/useGames";

// White small letter, Black big letter
const pieceImages: { [key: string]: string } = {
  P: White_Pawn,
  p: Black_Pawn,
  N: White_Knight,
  n: Black_Knight,
  B: White_Bishop,
  b: Black_Bishop,
  R: White_Rook,
  r: Black_Rook,
  Q: White_Queen,
  q: Black_Queen,
  K: White_King,
  k: Black_King,
};

const getBorderRadiusClass = (index: number, isWhitePlayer: boolean) => {
  switch (index) {
    case 0:
      return isWhitePlayer ? styles.borderTopLeft : styles.borderBottomRight;
    case 7:
      return isWhitePlayer ? styles.borderTopRight : styles.borderBottomLeft;
    case 56:
      return isWhitePlayer ? styles.borderBottomLeft : styles.borderTopRight;
    case 63:
      return isWhitePlayer ? styles.borderBottomRight : styles.borderTopLeft;
    default:
      return "";
  }
};

const indexToSquare = (index: number): ChessSquare => {
  const file = String.fromCharCode(97 + (index % 8));
  const rank = 8 - Math.floor(index / 8);
  return `${file}${rank}` as ChessSquare;
};

// const GamingArcade = () => {
//   return 
// }

const Chessboard: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { socket, setSocket } = useSocket();

  const inviteCode = searchParams.get("inviteCode");
  const gameCode = searchParams.get("gameCode");

  const [compInviteCode, setCompInviteCode] = useState(inviteCode);
  const [compGameCode, setCompGameCode] = useState(gameCode);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [chess, setChess] = useState(new Chess());
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(64).fill(null)
  );
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<ChessSquare[]>([]);
  const [shake, setShake] = useState(false);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState<string[]>([]);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [isValidGame, setIsValidGame] = useState(false);
  const isWhitePlayer = playerColor == "w";
  const [openFinalModal, setOpenFinalModal] = useState(false);

  const { data: gameData } = useGetGameWithInviteCode(inviteCode);

  console.log("gameData === ", gameData);

  useEffect(() => {
    if (socket) {
      if (compInviteCode) {
        socket.emit("joinGame", inviteCode);
        setCompInviteCode("");
      } else if (compGameCode) {
        socket.emit("createGame", gameCode);
        setCompGameCode("");
      }
    }
  }, [inviteCode, gameCode, socket]);

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
        setIsValidGame(true);
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
        setIsValidGame(true);
      });

      socket.on("moveMade", (game: any) => {
        const newChess = new Chess(game.chess);
        setChess(newChess);
        updateBoard(newChess);
        setCapturedWhitePieces(game.capturedWhitePieces);
        setCapturedBlackPieces(game.capturedBlackPieces);
      });

      socket.on("error", (message) => {
        // Game completion errors
        if (message?.errorType == "GAME_OVER") {
          setOpenFinalModal(true);
          return;
        }
        if (message?.errorType == "GAME_DRAW") {
          alert("GAME DRAW");
          return;
        }
        handleShakeScreen();
        setSnackbarMessage(message?.errorMessage);

        // Error while connecting to a game
        if (
          message?.errorType == "GAME_EXISTS" ||
          message?.errorType == "GAME_NOT_FOUND" ||
          message?.errorType == "LOBBY_FULL"
        ) {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
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
    setPossibleMoves([]);
    setSelectedSquare(null);
  };

  const handleSquareClick = (index: number) => {
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
        if (chess.turn() != playerColor) {
          setSnackbarMessage("Not your turn!");
        } else if (!piece) setSnackbarMessage("Select a piece!");
        else if (piece.color !== playerColor)
          setSnackbarMessage("Not your piece!");
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
  };

  useEffect(() => {
    updateBoard(chess);
  }, [updateBoard, chess]);

  const handleCloseSnackbar = () => setSnackbarMessage("");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
  };

  const doesPossibleMoveCutsPiece = (index: number) => {
    const fromSquare = indexToSquare(index);
    const piece = chess.get(fromSquare);

    return piece && possibleMoves.includes(fromSquare);
  };

  // Loading the game
  if (!isValidGame)
    return (
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={3000}
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
      </>
    );

  return (
    <Box
      sx={{
        height: "fit-content",
        width: "100%",
      }}
    >
      {gameCode ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 1,
            px: 3,
            backgroundColor: "#FF5C00",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "Center",
              columnGap: "12px",
            }}
          >
            Invite you friend using this code - {gameCode}
            <ContentCopy
              onClick={handleCopyCode}
              style={{ cursor: "pointer" }}
              fontSize="small"
            />
          </Typography>
        </Box>
      ) : null}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box className={styles.boardContainer}>
          {/* The player box */}

          {/* The player box */}
          {isWhitePlayer ? (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: "10%",
                  left: "0",
                  transform: "translateX(-100%)",
                }}
              >
                <PlayerComp
                  isActive={chess.turn() == "b"}
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
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  right: "0",
                  transform: "translateX(100%)",
                }}
              >
                <PlayerComp
                  isActive={chess.turn() == "w"}
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
            </>
          ) : (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: "10%",
                  left: "0",
                  transform: "translateX(-100%)",
                }}
              >
                <PlayerComp
                  isActive={chess.turn() == "w"}
                  alignDirection={"right"}
                  title="Parikshit Singh"
                  rank={"Junior"}
                  pieces={[
                    ...capturedWhitePieces.map(
                      (piece) => pieceImages[piece.toLowerCase()]
                    ),
                  ]}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  right: "0",
                  transform: "translateX(100%)",
                }}
              >
                <PlayerComp
                  isActive={chess.turn() == "b"}
                  alignDirection={"left"}
                  title="Sanjay Meena"
                  rank={"Master"}
                  pieces={[
                    ...capturedBlackPieces.map(
                      (piece) => pieceImages[piece.toUpperCase()]
                    ),
                  ]}
                />
              </Box>
            </>
          )}

          <Box
            className={`${styles.board} ${shake ? styles.shake : ""}`}
            style={{
              transform: isWhitePlayer ? "none" : "rotate(180deg)",
            }}
          >
            {shake && <Box className={styles.errorBox} />}
            {squares.map((piece, index) => (
              <Box
                key={index}
                className={`${styles.square} ${
                  (Math.floor(index / 8) + (index % 8)) % 2 === 0
                    ? styles.white
                    : styles.black
                } ${getBorderRadiusClass(index, isWhitePlayer)}`}
                onClick={() => handleSquareClick(index)}
                sx={{
                  backgroundColor:
                    selectedSquare === index ? "#FF5C00 !important" : "inherit",
                }}
                style={{
                  transform: isWhitePlayer ? "none" : "rotate(180deg)",
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
                  <Box
                    className={`${styles.possibleMove} ${
                      doesPossibleMoveCutsPiece(index) &&
                      styles.possibleMoveCanCut
                    }`}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
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
        <Typography variant="h6">
          Who&apos;s Turn? {chess.turn() == "w" ? "White" : "Black"}
        </Typography>
        <Typography variant="h3">
          You are {playerColor == "w" ? "White Player" : "Black Player"}
        </Typography>
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
      {openFinalModal && (
        <FinalModal
          handleClose={() => null}
          playerName={`${playerColor}-player`}
        />
      )}
    </Box>
  );
};

export default Chessboard;
