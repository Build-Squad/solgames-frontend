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

const drawerWidth = 240;
const navLoggedInItems = ["Home", "Ranking", "Games"];
const navLoggedOutItems = ["Play", "Puzzles", "Learn", "Watch", "Community"];

const DrawerAppBar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { login, loggedIn, logout } = useWeb3Auth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const renderDrawerItems = (items: string[]) => {
    return items.map((item) => (
      <ListItem key={item} disablePadding>
        <ListItemButton sx={{ textAlign: "center" }}>
          <ListItemText primary={item} />
        </ListItemButton>
      </ListItem>
    ));
  };

  const renderNavButtons = (items: string[]) => {
    return items.map((item) => (
      <Button key={item} sx={{ color: "#757575" }}>
        {item}
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
        {loggedIn
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
            {loggedIn
              ? renderNavButtons(navLoggedInItems)
              : renderNavButtons(navLoggedOutItems)}
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderRadius: "20px",
                border: "1px solid white",
                px: 4,
                fontWeight: "bold",
              }}
              onClick={loggedIn ? logout : login}
            >
              {loggedIn ? "Logout" : "Login / Signup"}
            </Button>
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
    </Box>
  );
};

export default DrawerAppBar;
