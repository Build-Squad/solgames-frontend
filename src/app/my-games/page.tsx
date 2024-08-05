"use client";
import { useAuth } from "@/context/authContext";
import { useGetAllGames } from "@/hooks/api-hooks/useGames";
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { EventHandler, useEffect, useState } from "react";
import GameDetailsModal from "@/components/modals/gameDetailsModal";
import { STATUS_COLORS } from "@/utils/constants";
import { CheckCircle, Cancel, ContentCopy } from "@mui/icons-material";
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

const renderGameStatus = (params) => {
  const value = params.value;
  const chipStyle = STATUS_COLORS[value];
  return <Chip color="success" label={value} sx={{ ...chipStyle }} />;
};

const DropdownMenu = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "action-menu" }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const MyGames = () => {
  const { user } = useAuth();
  const {
    data: userGames,
    updatedRefetch,
    isLoading,
  } = useGetAllGames(user?.id);
  const [selectedGame, setSelectedGame] = useState(null);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (user?.id) {
      updatedRefetch(user?.id);
    }
  }, [user?.id]);

  const handleRowClick = (params) => {
    setSelectedGame(params?.row);
  };

  return (
    <>
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
            rows={userGames ?? []}
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
                field: "actions",
                headerName: "Actions",
                flex: 1,
                headerAlign: "center",
                renderCell: (params) => (
                  <DropdownMenu options={["View Details", "Edit", "Delete"]} />
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
