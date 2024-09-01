"use client";
import { useAuth } from "@/context/authContext";
import { useGetAllGames } from "@/hooks/api-hooks/useGames";
import { Chip, Tabs, Tab, Tooltip, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import GameDetailsModal from "@/components/modals/gameDetailsModal";
import { CLAIM_ALERTS, STATUS_COLORS } from "@/utils/constants";
import {
  CheckCircle,
  Cancel,
  ContentCopy,
  Close,
  MonetizationOn,
  HourglassEmpty,
  EventBusy,
  Remove,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { useSnackbar } from "@/context/snackbarContext";

const renderIsGameAccepted = (params) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {params.value ? (
        <CheckCircle
          sx={{
            color: "#4CAF50",
          }}
        />
      ) : (
        <Cancel sx={{ color: "#F44336" }} />
      )}
    </Box>
  );
};

const ClaimsComponent = ({
  winnerId,
  gameStatus,
}: {
  winnerId?: string;
  gameStatus: string;
}) => {
  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const handleOnClick = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    type: "WON" | "LOST" | "PENDING" | "EXPIRED" | "DRAW"
  ) => {
    e.stopPropagation();

    // Handle notifications with no withdrawl
    if (type == "LOST") {
      showMessage(CLAIM_ALERTS.LOST, "info");
    }
    if (type == "PENDING") {
      showMessage(CLAIM_ALERTS.PENDING, "info");
    }

    // Handle withdrawls
    if (type == "WON") {
      // Handle withdrawl funds to the winner account
    } else if (type == "EXPIRED") {
      // Handle withdrawl funds to the creator's account
    } else if (type == "DRAW") {
      // Handle withdrawl funds to both the accounts
    }
  };

  const gameNotCompletedStatusArr = [
    STATUS_COLORS.Accepted.value,
    STATUS_COLORS.Scheduled.value,
    STATUS_COLORS.InProgress.value,
  ];

  return (
    <Box sx={{ mt: 1 }}>
      {/* The game has a winner */}
      {winnerId == user?.id && (
        <Tooltip title="Claim Funds">
          <MonetizationOn
            sx={{ cursor: "pointer", color: "#4CAF50" }}
            onClick={(e) => {
              handleOnClick(e, "WON");
            }}
          />
        </Tooltip>
      )}
      {/* The game has a winner but not the current user */}
      {winnerId && winnerId != user?.id && (
        <Tooltip title="You've lost the game.">
          <Close
            sx={{ color: "#D32F2F" }}
            onClick={(e) => {
              handleOnClick(e, "LOST");
            }}
          />
        </Tooltip>
      )}
      {/* The game is pending */}
      {gameNotCompletedStatusArr.includes(gameStatus) && (
        <Tooltip title="Decision Pending">
          <HourglassEmpty
            sx={{ color: "#FFA000" }}
            onClick={(e) => {
              handleOnClick(e, "PENDING");
            }}
          />
        </Tooltip>
      )}
      {/* Game is expired due to no acceptor before the game starts.*/}
      {gameStatus === STATUS_COLORS.Expired.value && (
        <Tooltip title="Expired Game">
          <EventBusy
            sx={{ color: "#616161" }}
            onClick={(e) => {
              handleOnClick(e, "EXPIRED");
            }}
          />
        </Tooltip>
      )}
      {/* Game is draw*/}
      {gameStatus === STATUS_COLORS.Draw.value && (
        <Tooltip title="Game Draw">
          <RemoveCircleOutline
            sx={{ color: "#FFC107" }}
            onClick={(e) => {
              handleOnClick(e, "DRAW");
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

const renderGameStatus = (params) => {
  const value = params.value;
  const chipStyle = STATUS_COLORS[value];
  return <Chip color="success" label={value} sx={{ ...chipStyle }} />;
};

const MyGames = () => {
  const { user } = useAuth();
  const {
    data: userGames,
    updatedRefetch,
    isLoading,
  } = useGetAllGames(user?.id);
  const [selectedGame, setSelectedGame] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (user?.id) {
      updatedRefetch(user?.id);
    }
  }, [user?.id]);

  const handleRowClick = (params) => {
    setSelectedGame(params?.row);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredGames =
    tabValue === 0
      ? userGames?.filter((game) => game.creatorId === user?.id)
      : userGames?.filter((game) => game.acceptorId === user?.id);

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mt: 3 }}
          TabIndicatorProps={{
            sx: {
              display: "none",
            },
          }}
        >
          <Tab
            label="Games Created"
            sx={{
              backgroundColor: tabValue === 0 ? "#FF5C00" : "#f5f5f5",
              borderRadius: "8px",
              px: 10,
              py: 2,
              mx: 1,
              fontWeight: "bold",
              "&.MuiButtonBase-root": {
                color: tabValue === 0 ? "white" : "black",
              },
            }}
          />
          <Tab
            label="Games Accepted"
            sx={{
              color: "black",
              backgroundColor: tabValue === 1 ? "#FF5C00" : "#f5f5f5",
              borderRadius: "8px",
              px: 10,
              py: 2,
              mx: 1,
              fontWeight: "bold",
              "&.MuiButtonBase-root": {
                color: tabValue === 1 ? "white" : "black",
              },
            }}
          />
        </Tabs>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          m="8px 0 0 0"
          width="100%"
          sx={{
            padding: "2% 5%",
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#bdbdbd",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: "#bdbdbd",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `#e0e0e0 !important`,
            },
          }}
        >
          <DataGrid
            rows={filteredGames ?? []}
            columns={[
              {
                field: "id",
                headerName: "ID",
                flex: 1,
              },
              {
                field: "token",
                headerName: "Token",
                flex: 1,
                headerAlign: "center",
                cellClassName: "center-align",
              },
              {
                field: "betAmount",
                headerName: "Bet Amount",
                flex: 1,
                headerAlign: "center",
                cellClassName: "center-align",
              },
              {
                field: "inviteCode",
                headerName: "Invite Code",
                flex: 1,
                headerAlign: "center",
                cellClassName: "center-align",
                renderCell: (params) => {
                  const handleCopyCode = (e) => {
                    e.stopPropagation();
                    showMessage("Code copied to clipboard", "success");
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_FRONTEND}/join-game?joiningCode=${params.value}`
                    );
                  };
                  return (
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        columnGap: "12px",
                      }}
                    >
                      {params.value}
                      <ContentCopy
                        onClick={handleCopyCode}
                        style={{ cursor: "pointer", fontSize: "12px" }}
                      />
                    </span>
                  );
                },
              },
              {
                field: "gameDateTime",
                headerName: "Event Date Time",
                flex: 1,
                headerAlign: "center",
                renderCell: (params) => {
                  const date = new Date(params.value);
                  return date.toLocaleString();
                },
                cellClassName: "center-align",
              },
              {
                field: "isGameAccepted",
                headerName: "Game Accepted",
                flex: 1,
                headerAlign: "center",
                renderCell: renderIsGameAccepted,
                cellClassName: "center-align",
              },
              {
                field: "gameStatus",
                headerName: "Status",
                flex: 1,
                headerAlign: "center",
                renderCell: renderGameStatus,
                cellClassName: "center-align",
              },
              {
                field: "claims",
                headerName: "Claims",
                flex: 1,
                headerAlign: "center",
                renderCell: (params) => (
                  <ClaimsComponent
                    winnerId={params?.row?.winnerId}
                    gameStatus={params?.row?.gameStatus}
                  />
                ),
                cellClassName: "center-align",
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-cell:hover": {
                cursor: "pointer",
              },
              "& .center-align": {
                textAlign: "center",
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnMenu
            density="comfortable"
            loading={isLoading}
            onRowClick={handleRowClick}
          />
        </Box>
      </Box>
      {!!selectedGame ? (
        <GameDetailsModal
          handleClose={() => setSelectedGame(null)}
          game={selectedGame}
        />
      ) : null}
    </>
  );
};

export default MyGames;
