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
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth="md"
      classes={{ paper: styles.congratsDialogPaper }}
    >
      <DialogTitle>
        <div className={styles.congratsTitle}>Draw!</div>
      </DialogTitle>
      <DialogContent>
        <div className={styles.congratsContent}>
          <p>The game is draw !</p>
          <p>
            The game is draw! It was an amazing match between you two folks.
            Navigate to home screen to join or create new tournament.
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className={styles.congratsButton} onClick={handleClick}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawModal;
