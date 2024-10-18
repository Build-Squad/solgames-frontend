import { Box } from "@mui/material";
import World_map from "../../assets/World_map.svg";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        backgroundColor: "#252525",
        backgroundImage: `url(${World_map.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "70px",
      }}
    >
      {children}
    </Box>
  );
}
