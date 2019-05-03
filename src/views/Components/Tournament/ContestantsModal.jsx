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
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function ContestantsModal({ ...props }) {
  const { classes, openState, closeModal, participants, maxPlayers } = props;

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      open={openState}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => closeModal("contestantsModal")}
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
          onClick={() => closeModal("contestantsModal")}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        Participants
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <h3>
          {participants.length} / {maxPlayers}
        </h3>
        {participants.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Organization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((user, i) => (
                <TableRow cursor="pointer" key={i + 1}>
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.organization}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          ""
        )}
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(ContestantsModal);
