import { Box } from "@mui/material";
import World_map from "../../assets/World_map.svg";
import { SocketProvider } from "@/context/socketContext";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <Box
        sx={{
          height: "100vh",
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
    </SocketProvider>
  );
}
