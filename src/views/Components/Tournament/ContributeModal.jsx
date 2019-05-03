import React from "react";
import {
  withStyles,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment
} from "@material-ui/core";
import Card from "components/Card/Card";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function ContributeModal({ ...props }) {
  const {
    classes,
    openState,
    closeModal,
    tokenName,
    handleSimple,
    handleFunding
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
      onClose={() => closeModal("contributeModal")}
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
          onClick={() => closeModal("contributeModal")}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        Contribute To Prize Pool
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <Card plain={true}>
          <CustomInput
            inputProps={{
              name: "contribution",
              type: "number",
              onChange: handleSimple,
              required: true,
              startAdornment: (
                <InputAdornment position="start">{tokenName}</InputAdornment>
              )
            }}
          />
          <br />
          <Button color="success" onClick={() => handleFunding()}>
            Contribute
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(ContributeModal);
