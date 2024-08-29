import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import styles from "./drawModal.module.css";
import { Balance } from "@mui/icons-material"; // Use Balance icon for a neutral look

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DrawModal = ({ handleClose, playerName }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") {
          return;
        }
        handleClose();
      }}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth="md"
      classes={{ paper: styles.drawDialogPaper }}
    >
      <DialogTitle>
        <div className={styles.drawTitle}>Game Drawn</div>
      </DialogTitle>
      <DialogContent>
        <div className={styles.drawContent}>
          <Balance style={{ fontSize: "200px", color: "#4b6cb7" }} />{" "}
          <p>The game ended in a draw.</p>
          <p>
            Both players showed great skill. Go to the home screen to join or
            create a new game.
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className={styles.drawButton} onClick={handleClick}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawModal;
