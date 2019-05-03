import React from "react";
import {
  withStyles,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core";
import Card from "components/Card/Card";
import Button from "components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function SelectWinnerModal({ ...props }) {
  const { classes, openState, closeModal, match, handleWinner } = props;

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      open={openState}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => closeModal("selectWinnerModal")}
      aria-labelledby="modal-slide-title"
      aria-describedby="modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <IconButton
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => closeModal("selectWinnerModal")}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        Select Match Winner
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <Card plain={true}>
          <Button
            style={{ backgroundColor: "black", borderRadius: "0.5rem" }}
            onClick={() => {
              handleWinner(match.id, 1);
              closeModal("selectWinnerModal");
            }}
          >
            P1: {match.player1 ? match.player1.name : ""}
          </Button>
          <h3>VS</h3>
          <Button
            style={{ backgroundColor: "black", borderRadius: "0.5rem" }}
            onClick={() => {
              handleWinner(match.id, 2);
              closeModal("selectWinnerModal");
            }}
          >
            P2: {match.player2 ? match.player2.name : ""}
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(SelectWinnerModal);
