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
import styles from "./looserModal.module.css";
import { SentimentDissatisfied } from "@mui/icons-material";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LoserModal = ({ handleClose, content }) => {
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
      classes={{ paper: styles.sorryDialogPaper }}
    >
      <DialogTitle>
        <div className={styles.sorryTitle}>Game Over!</div>
      </DialogTitle>
      <DialogContent>
        <div className={styles.sorryContent}>
          <SentimentDissatisfied style={{ fontSize: "200px" }} />
          {content}
        </div>
      </DialogContent>
      <DialogActions>
        <Button className={styles.sorryButton} onClick={handleClick}>
          Try Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoserModal;
