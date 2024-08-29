"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import ConnectModal from "../modals/connectModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "@/context/snackbarContext";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { getRandomColor } from "@/utils/helper";

const drawerWidth = 240;
const navLoggedInItems = [
  { text: "Home", route: "/" },
  { text: "Ranking", route: "/ranking" },
  { text: "My Games", route: "/my-games" },
];
const navLoggedOutItems = [
  { text: "Play", route: "/play" },
  { text: "Puzzles", route: "/puzzles" },
  { text: "Learn", route: "/learn" },
  { text: "Watch", route: "/watch" },
  { text: "Community", route: "/community" },
];
const profileBackgroundColor = getRandomColor();

const DrawerAppBar = () => {
  const router = useRouter();
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useWeb3Auth();
  const { disconnect, publicKey } = useWallet();
  const { logout: logoutUser } = useAuth();
  const { user } = useAuth();
  const { showMessage } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push("/my-games");
    handleClose();
  };

  useEffect(() => {
    if (user?.id) {
      setOpenConnectModal(false);
    }
  }, [user?.id]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    if (publicKey) {
      try {
        logoutUser();
        showMessage("Logged out!", "success");
        disconnect();
      } catch (e) {
        console.log("Error in disconnecting:", e);
      }
    } else {
      try {
        logout();
      } catch (e) {
        console.log("Error in logging out:", e);
      }
    }
  };

  const renderDrawerItems = (items) => {
    return items.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          onClick={() => {
            router.push(item.route);
            handleDrawerToggle();
          }}
          sx={{ textAlign: "center" }}
        >
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ));
  };

  const renderNavButtons = (items) => {
    return items.map((item) => (
      <Button
        key={item.text}
        sx={{ color: "#757575" }}
        onClick={() => router.push(item.route)}
      >
        {item.text}
      </Button>
    ));
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CHESSMATE
      </Typography>
      <Divider />
      <List>
        {!!user?.id
          ? renderDrawerItems(navLoggedInItems)
          : renderDrawerItems(navLoggedOutItems)}
      </List>
    </Box>
  );

  const container = React.useMemo(
    () =>
      typeof window !== "undefined" ? () => window.document.body : undefined,
    []
  );

  return (
    <Box sx={{}}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          "&.MuiPaper-root": {
            backgroundColor: "transparent",
            boxShadow: "none",
            paddingX: "5%",
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              cursor: "pointer",
            }}
            onClick={() => {
              router.push("/");
            }}
          >
            CHESSMATE
          </Typography>
          <Box sx={{ display: "flex", columnGap: "8px" }}>
            {!!user?.id ? (
              <>
                {renderNavButtons(navLoggedInItems)}
                <Button
                  onClick={() => router.push("/profile")}
                  sx={{ color: "#757575" }}
                >
                  Profile
                </Button>
                <Avatar
                  onClick={handleClick}
                  sx={{
                    bgcolor: profileBackgroundColor,
                    cursor: "pointer",
                    padding: "20px",
                  }}
                >
                  {user?.publicKey.slice(0, 2)}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      bgcolor: "#f9f9f9",
                      color: "#333",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <MenuItem>
                    <Typography
                      fontWeight={"bold"}
                      sx={{ wordBreak: "break-all" }}
                    >
                      {user?.publicKey
                        ? `${user?.publicKey.slice(
                            0,
                            4
                          )}.......${user?.publicKey.slice(-4)}`
                        : null}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {renderNavButtons(navLoggedOutItems)}
                <Button
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    borderRadius: "20px",
                    border: "1px solid white",
                    px: 4,
                    fontWeight: "bold",
                  }}
                  onClick={() => setOpenConnectModal(true)}
                >
                  Connect
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {openConnectModal ? (
        <ConnectModal
          open={openConnectModal}
          onClose={() => {
            setOpenConnectModal(false);
          }}
        />
      ) : null}
    </Box>
  );
};

export default DrawerAppBar;
