"use client";
import { useAuth } from "@/context/authContext";
import { useGetAllGames } from "@/hooks/api-hooks/useGames";
import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const renderIsGameAccepted = (params) => {
  const value = params.value;
  let color;

  switch (value) {
    case true:
      color = "success";
      break;
    case false:
      color = "warning";
      break;
    default:
      color = "default";
  }

  return (
    <span style={{ color }} className="game-status-pill">
      {value ? "Accepted" : "Pending"}
    </span>
  );
};

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "token", headerName: "Token", width: 150 },
  { field: "betAmount", headerName: "Bet Amount", width: 150 },
  { field: "inviteCode", headerName: "Invite Code", width: 200 },
  { field: "gameDateTime", headerName: "Game Date Time", width: 200 },
  {
    field: "isGameAccepted",
    headerName: "Game Accepted",
    width: 150,
    renderCell: renderIsGameAccepted,
  },
  { field: "createdAt", headerName: "Created At", width: 200 },
  { field: "updatedAt", headerName: "Updated At", width: 200 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <DropdownMenu options={["View Details", "Edit", "Delete"]} />
    ),
  },
];

const DropdownMenu = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        Actions
      </button>
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
  const { data: userGames, refetch: refetchUserGames } = useGetAllGames(
    user?.id
  );

  useEffect(() => {
    console.log("user?.id ==== ", user?.id);
    refetchUserGames();
  }, [user?.id]);

  console.log("userGames  ==== ", userGames);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={userGames ?? []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default MyGames;
