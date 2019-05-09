import React from "react";
import { withStyles, Slide, Dialog, DialogContent } from "@material-ui/core";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";
import CircularProgress from "components/CircularProgress";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function SignInModal({ ...props }) {
  const { classes, openState, closeModal } = props;

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      open={openState}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => closeModal("signInModal")}
      aria-labelledby="modal-slide-title"
      aria-describedby="modal-slide-description"
    >
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <GridContainer>
          <GridItem xs={12}>
            <GridContainer justify="center">
              <p>Please Sign The Metamask Request To Proceed With Sign On</p>
            </GridContainer>
          </GridItem>
          <GridItem xs={12}>
            <GridContainer justify="center">
              <CircularProgress />
            </GridContainer>
          </GridItem>
        </GridContainer>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(SignInModal);
