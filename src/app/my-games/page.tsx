"use client";
import { useAuth } from "@/context/authContext";
import { useGetAllGames } from "@/hooks/api-hooks/useGames";
import { Chip, Tabs, Tab, Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import GameDetailsModal from "@/components/modals/gameDetailsModal";
import { STATUS_COLORS } from "@/utils/constants";
import { CheckCircle, Cancel, ContentCopy } from "@mui/icons-material";
import { useSnackbar } from "@/context/snackbarContext";
import ClaimsComponent from "@/components/claimComponent";
import Image from "next/image";
import No_data from "@/assets/No_data.svg";

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

const MyGames = () => {
  const { user } = useAuth();
  const {
    data: userGames,
    updatedRefetch,
    isLoading,
    refetch,
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

  const columns: GridColDef<any>[] = [
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
      renderCell: (params) => {
        return (
          <ClaimsComponent
            inviteCode={params?.row?.inviteCode}
            winnerId={params?.row?.winnerId}
            gameStatus={params?.row?.gameStatus}
            withdrawals={params?.row?.withdrawals ?? []}
            refetch={refetch}
          />
        );
      },
      cellClassName: "center-align",
    },
  ];

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
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 8,
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
            pageSizeOptions={[8, 16]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnMenu
            density="comfortable"
            loading={isLoading}
            onRowClick={handleRowClick}
            slots={{
              
              noRowsOverlay: NoDataOverlay,
            }}
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

const NoDataOverlay = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <Image
      src={No_data}
      alt="No data"
      height={100}
      width={100}
      style={{ height: "40%", width: "40%" }}
    />
    <Typography sx={{ fontWeight: "bold", fontSize: "32px" }}>
      No Games found...
    </Typography>
  </div>
);
