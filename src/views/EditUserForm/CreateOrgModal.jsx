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
import Input from "@material-ui/core/Input/index";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

function CreateOrgModal({...props}) {
    const {classes, openState, closeModal, handleSimple, saveOrg} = props;

    return (
        <Dialog
            classes={{
                root: classes.center,
                paper: classes.modal
            }}
            open={openState}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => closeModal("createOrgModal")}
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
                    onClick={() => closeModal("createOrgModal")}
                >
                    <Close className={classes.modalClose}/>
                </IconButton>
                Create New Organization
            </DialogTitle>
            <DialogContent id="modal-slide-description" className={classes.modalBody}>
                <Card plain={true}>
                    <Input
                        inputProps={{
                            name: "organizationName",
                            type: "text",
                            onChange: handleSimple,
                            required: true,
                            autoFocus: false,
                            placeholder: "organization name"
                        }}
                    />
                    <Button
                        style={{borderRadius: "0.5rem", backgroundColor: "red"}}
                        onClick={() => {
                            saveOrg();
                            closeModal("createOrgModal");
                        }}
                    >
                        Create
                    </Button>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default withStyles(modalStyle)(CreateOrgModal);
