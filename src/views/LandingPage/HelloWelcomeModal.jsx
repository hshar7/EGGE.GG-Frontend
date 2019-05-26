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
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

function HelloWelcomeModal({...props}) {
    const {
        classes,
        openState,
        closeModal
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
            onClose={() => closeModal("helloWelcomeModal")}
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
                    onClick={() => closeModal("helloWelcomeModal")}
                >
                    <Close className={classes.modalClose}/>
                </IconButton>
                <h3>Hello! Welcome to EggE.gg</h3>
            </DialogTitle>
            <DialogContent id="modal-slide-description" className={classes.modalBody}>
                <Card plain={true}>
                    <h4>an eSports tournaments decentralized web application!</h4>
                    <h4>This is an ALPHA version of the final app.</h4>
                    <h4>You need a web3 capable browser to interact!</h4>
                    <h4>Download Metamask from https://metamask.io/ to get going!</h4>
                    <h4>Running on Rinkeby testnet.</h4>
                    <h4>Please submit all feedback to hayder.net@gmail.com</h4>
                    <h4>Enjoy your stay :-)</h4>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default withStyles(modalStyle)(HelloWelcomeModal);
