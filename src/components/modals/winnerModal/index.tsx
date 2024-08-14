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
import styles from "./winnerModal.module.css";
import { EmojiEvents } from "@mui/icons-material";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WinnerModal = ({ handleClose, content }) => {
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
      classes={{ paper: styles.congratsDialogPaper }}
    >
      <DialogTitle>
        <div className={styles.congratsTitle}>Congratulations!</div>
      </DialogTitle>
      <DialogContent>
        <div className={styles.congratsContent}>
          <EmojiEvents style={{ fontSize: "200px" }} />
          {content}
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

export default WinnerModal;
