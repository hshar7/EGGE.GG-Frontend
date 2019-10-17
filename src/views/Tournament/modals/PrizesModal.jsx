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
import CardBody from "components/Card/CardBody";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function PrizesModal({ ...props }) {
  const { classes, openState, closeModal, tournament } = props;
  const token = tournament.token ? tournament.token : {};
  const prizeDistribution = tournament.prizeDistribution
    ? tournament.prizeDistribution
    : [];

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
      onClose={() => closeModal("prizesModal")}
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
          onClick={() => closeModal("prizesModal")}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        Prize distribution
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Place</TableCell>
                <TableCell align="right">Percentage</TableCell>
                <TableCell align="right">In {token.name} </TableCell>
                <TableCell align="right">In USD</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prizeDistribution.map((percentage, i) => (
                <TableRow cursor="pointer" key={i + 1}>
                  <TableCell component="th" scope="row">
                    {" "}
                    {i + 1}{" "}
                  </TableCell>
                  <TableCell align="right">{percentage}%</TableCell>
                  <TableCell align="right">
                    {Number((percentage * tournament.prize) / 100).toFixed(8)}
                  </TableCell>
                  <TableCell align="right">
                    $
                    {Number(
                      ((percentage * tournament.prize) / 100) * token.usdPrice
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CardBody>
            1 {token.name} = ${token.usdPrice}
          </CardBody>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(modalStyle)(PrizesModal);
