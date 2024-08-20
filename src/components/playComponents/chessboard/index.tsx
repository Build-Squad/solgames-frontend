"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import { Chess, Square as ChessSquare } from "chess.js";
import PlayerComp from "@/components/playComponents/playerComp";
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
import { useSocket } from "@/context/socketContext";
import WinnerModal from "../../modals/winnerModal";
import { useSnackbar } from "@/context/snackbarContext";
import { useAuth } from "@/context/authContext";
import DrawModal from "@/components/modals/drawModal";
import MoveWarningSnackbar, {
  WARNING_TIME_IN_SECONDS,
} from "../moveWarningSnackbar";
import LooserModal from "@/components/modals/looserModal";

const PLAYER_TURN_TIME = 240;

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

const TIMEOUT_ERRORS = {
  EXCEED_TIMEOUT_COUNT:
    "You've lost the game due to inactivity for more than 3 times.",
  INACTIVITY_EXHAUST:
    "You have lost the game as you were inactive for way too long!",
};

const indexToSquare = (index: number): ChessSquare => {
  const file = String.fromCharCode(97 + (index % 8));
  const rank = 8 - Math.floor(index / 8);
  return `${file}${rank}` as ChessSquare;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const Chessboard = () => {
  const router = useRouter();

  // State related to chessboard
  const [chess, setChess] = useState(new Chess());
  const [shake, setShake] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<ChessSquare[]>([]);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState<string[]>([]);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState<string[]>([]);
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(64).fill(null)
  );

  // State related to game completion
  const [openDrawModal, setOpenDrawModal] = useState(false);
  const [winnerModalData, setWinnerModalData] = useState({
    state: false,
    content: <></>,
  });
  const [looserModalData, setLooserModalData] = useState({
    state: false,
    content: <></>,
  });

  // State related to player's and game
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<"w" | "b" | null>(null);

  // State related to timer and game starting
  const [turnTimer, setTurnTimer] = useState(PLAYER_TURN_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [showMoveWarning, setShowMoveWarning] = useState(false);
  const [timeoutCount, setTimeoutCount] = useState(0);

  // State related to pawn promotion
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState<ChessSquare | null>(
    null
  );
  const [promotionFrom, setPromotionFrom] = useState<ChessSquare | null>(null);

  const { socket } = useSocket();
  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const isWhitePlayer = playerColor == "w";

  const handleInactivity = (type: keyof typeof TIMEOUT_ERRORS) => {
    // In this case, the other person would've and we call socket to end the game.
    showMessage(TIMEOUT_ERRORS[type], "error", 10000);
    socket?.emit("inactiveUser", { gameId });
  };

  // This is for the 4 minute timer for each player starting once both the player's have joined.
  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        if (activePlayer === chess.turn()) {
          setTurnTimer((prev) => {
            // If the 4 minute is complete, i.e. timer reaches zero.
            if (prev <= 1) {
              // If there's an active player, and the current player color is the one who's turn is there.
              if (activePlayer && playerColor == chess.turn()) {
                if (timeoutCount > 2) {
                  handleInactivity("EXCEED_TIMEOUT_COUNT");
                } else {
                  setShowMoveWarning(true);
                  setTimeoutCount((prev) => prev + 1);
                }
              }
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activePlayer, chess.turn(), gameStarted]);

  // Board related logic and functions
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

  const handleSquareSelection = (index: number) => {
    const fromSquare = indexToSquare(index);
    const piece = chess.get(fromSquare);

    if (!piece) {
      handleShakeScreen();
      showMessage("No piece selected!", "error");
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

    if (isPromotionMove(from, to)) {
      setPromotionFrom(from);
      setPromotionSquare(to);
      setPromotionDialogOpen(true);
    } else {
      executeMove(move);
    }

    setPossibleMoves([]);
    setSelectedSquare(null);

    handleCloseSnackbar();
  };

  const isPromotionMove = (from: ChessSquare, to: ChessSquare) => {
    const piece = chess.get(from);
    if (piece && piece.type === "p") {
      const targetRank = piece.color === "w" ? "8" : "1";
      return to[1] === targetRank;
    }
    return false;
  };

  const executeMove = (move: {
    from: ChessSquare;
    to: ChessSquare;
    promotion?: string;
  }) => {
    socket?.emit("makeMove", { gameId, move, userId: user.id });
  };

  const handlePromotion = (pieceType: string) => {
    if (promotionSquare && promotionFrom) {
      const move = {
        from: promotionFrom,
        to: promotionSquare,
        promotion: pieceType,
      };
      executeMove(move);
      setPromotionDialogOpen(false);
    }
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
          showMessage("Not your turn!", "error");
        } else if (!piece) showMessage("Select a piece!", "error");
        else if (piece.color !== playerColor)
          showMessage("Not your piece!", "error");
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

  const doesPossibleMoveCutsPiece = (index: number) => {
    const fromSquare = indexToSquare(index);
    const piece = chess.get(fromSquare);

    return piece && possibleMoves.includes(fromSquare);
  };

  useEffect(() => {
    updateBoard(chess);
  }, [updateBoard, chess]);

  // Handling socket events from the backend and errors
  useEffect(() => {
    if (socket) {
      socket.on("playerJoined", (game: any) => {
        setGameId(game.id);
        // This is the fen passed from the BE.
        const newChess = new Chess(game.chess);
        setChess(newChess);
        updateBoard(newChess);
        const player = game.players.find(
          (player: any) => player.id === user.id
        );
        setPlayerColor(player.color);
        setActivePlayer(newChess.turn());
        if (game.players.length === 2) {
          setGameStarted(true);
        }
      });

      socket.on("moveMade", (game: any) => {
        const newChess = new Chess(game.chess);
        setChess(newChess);
        updateBoard(newChess);
        setCapturedWhitePieces(game.capturedWhitePieces);
        setCapturedBlackPieces(game.capturedBlackPieces);

        setActivePlayer(newChess.turn());
        setTurnTimer(PLAYER_TURN_TIME);
      });

      // Handling not only the errors but, game completion, game forfeiting as well
      socket.on("error", (message) => {
        // Game completion errors
        if (message?.errorType == "GAME_OVER") {
          if (playerColor) {
            // Handling winner and loser modals, the person who made the move is the winner.
            if (playerColor == activePlayer) {
              setWinnerModalData({
                state: true,
                content: (
                  <>
                    <p>
                      You&rsquo;ve won the game,{" "}
                      {playerColor == "b" ? "black" : "white"} player!
                    </p>
                    <p>
                      Checkmate! Your strategic moves have led you to victory.
                      Keep up the great play!
                    </p>
                  </>
                ),
              });
            } else {
              setLooserModalData({
                state: true,
                content: (
                  <>
                    <p>
                      Sorry, {playerColor == "b" ? "black" : "white"} player.
                      You&rsquo;ve lost the game.
                    </p>
                    <p>
                      Despite the loss, remember that every game is a learning
                      opportunity. Analyze your moves and come back stronger!
                    </p>
                  </>
                ),
              });
            }
          }
          return;
        }
        if (message?.errorType == "INACTIVE_USER") {
          if (playerColor) {
            // Handling winner and loser modals, the person who made the move is the winner.
            if (playerColor == message?.currentPlayer) {
              setLooserModalData({
                state: true,
                content: (
                  <>
                    <p>
                      Sorry, {playerColor == "b" ? "white" : "black"} player.
                      You&rsquo;ve lost the game.
                    </p>
                    <p>
                      Due to the inactivity rule breach, You&apos;ve lost the
                      game. Better luck next time.
                    </p>
                  </>
                ),
              });
            } else {
              setWinnerModalData({
                state: true,
                content: (
                  <>
                    <p>
                      You&rsquo;ve won the game,{" "}
                      {playerColor == "b" ? "black" : "white"} player!
                    </p>
                    <p>
                      As the other player has exceeded their time limit.
                      You&apos;ve been declared as a winnner
                    </p>
                  </>
                ),
              });
            }
          }
          return;
        }
        if (message?.errorType == "GAME_DRAW") {
          setOpenDrawModal(true);
          return;
        }
        handleShakeScreen();
        showMessage(message?.errorMessage, "error");

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
  }, [socket, updateBoard, handleShakeScreen, playerColor]);

  // Turn Warning logic
  const handleCloseSnackbar = () => {
    setShowMoveWarning(false);
  };

  const handleTimeout = () => {
    handleCloseSnackbar();
    handleInactivity("INACTIVITY_EXHAUST");
  };

  return (
    <>
      <Box
        sx={{ backgroundColor: "white", textAlign: "center", fontSize: "20px" }}
      >
        Ideal count - {timeoutCount}/3
      </Box>
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
                  timer={
                    activePlayer === "b" &&
                    !(
                      looserModalData.state ||
                      winnerModalData.state ||
                      openDrawModal
                    )
                      ? formatTime(turnTimer)
                      : null
                  }
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
                  timer={
                    activePlayer === "w" &&
                    !(
                      looserModalData.state ||
                      winnerModalData.state ||
                      openDrawModal
                    )
                      ? formatTime(turnTimer)
                      : null
                  }
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
                  timer={activePlayer === "w" ? formatTime(turnTimer) : null}
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
                  timer={activePlayer === "b" ? formatTime(turnTimer) : null}
                />
              </Box>
            </>
          )}

          <Box
            className={`${styles.board}`}
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

          <Dialog
            open={promotionDialogOpen}
            onClose={() => setPromotionDialogOpen(false)}
          >
            <Box sx={{ padding: 2 }}>
              <Typography>Select a piece for promotion:</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 2,
                }}
              >
                {["q", "r", "b", "n"].map((piece) => (
                  <Button key={piece} onClick={() => handlePromotion(piece)}>
                    <Image
                      src={pieceImages[piece]}
                      alt={`Promote to ${piece}`}
                      width={50}
                      height={50}
                    />
                  </Button>
                ))}
              </Box>
            </Box>
          </Dialog>
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
      {winnerModalData?.state && (
        <WinnerModal
          handleClose={() => null}
          content={winnerModalData?.content}
        />
      )}
      {looserModalData?.state && (
        <LooserModal
          handleClose={() => null}
          content={looserModalData?.content}
        />
      )}
      {openDrawModal && (
        <DrawModal
          handleClose={() => null}
          playerName={`${playerColor}-player`}
        />
      )}
      {showMoveWarning && (
        <MoveWarningSnackbar
          open={
            showMoveWarning &&
            !(looserModalData.state || winnerModalData.state || openDrawModal)
          }
          onClose={handleCloseSnackbar}
          initialTime={WARNING_TIME_IN_SECONDS}
          onTimeout={handleTimeout}
        />
      )}
    </>
  );
};

export default Chessboard;
