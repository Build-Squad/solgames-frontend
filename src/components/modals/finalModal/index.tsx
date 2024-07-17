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
import "./index.css";
import { EmojiEvents } from "@mui/icons-material";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Congratulations = ({ handleClose, playerName }) => {
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
      classes={{ paper: "congrats-dialog-paper" }}
    >
      <DialogTitle>
        <div className="congrats-title">Congratulations!</div>
      </DialogTitle>
      <DialogContent>
        <div className="congrats-content">
          <EmojiEvents style={{ fontSize: "200px" }} />
          <p>You&rsquo;ve won the game, {playerName}!</p>
          <p>
            Checkmate! Your strategic moves have led you to victory. Keep up the
            great play!
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className="congrats-button" onClick={handleClick}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Congratulations;
