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
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function WhitelistContributorModal({ ...props }) {
  const {
    classes,
    openState,
    closeModal,
    handleSimple,
    handleContributorWhitelist
  } = props;

  if (!openState) {
    return <div/>;
  }

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      open={openState}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => closeModal("whitelistContributorModal")}
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
          onClick={() => closeModal("whitelistContributorModal")}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        Allow Sponsor To Contribute
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <Card plain={true}>
          <CustomInput
            inputProps={{
              name: "contributorPublicAddress",
              type: "text",
              onChange: handleSimple,
              required: true,
              placeholder: "Contributor's public address"
            }}
          />
          <br />
          <Button color="success" onClick={() => handleContributorWhitelist()}>
            Whitelist contributor
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(WhitelistContributorModal);
