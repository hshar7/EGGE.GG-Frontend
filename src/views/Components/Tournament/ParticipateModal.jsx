import React from "react";
import {
  withStyles,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@material-ui/core";
import Card from "components/Card/Card";
import Button from "components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function ParticipateModal({ ...props }) {
  const {
    classes,
    openState,
    closeModal,
    tournamentId,
    userId,
    handleUserRegister
  } = props;

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      open={openState}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => closeModal("participateModal")}
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
          onClick={() => closeModal("participateModal")}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        Join This Tournament
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <Card plain={true}>
          <center>
            <h3>Registration Open</h3>
          </center>
        </Card>
        <Card plain={true}>
          <Button
            color="warning"
            onClick={() => window.open("https://metamask.io/", "_blank")}
          >
            1. Download MetaMask
          </Button>
        </Card>
        <Card plain={true}>
          <Button
            color="info"
            onClick={() => window.open("/editUser", "_self")}
          >
            2. Create an account
          </Button>
        </Card>
        <Card plain={true}>
          <Button
            color="danger"
            onClick={() => {
              handleUserRegister(tournamentId, userId);
              closeModal("participateModal");
            }}
          >
            3: Join Tournament
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(ParticipateModal);
