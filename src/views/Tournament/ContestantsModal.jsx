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
import tooltipsStyle from "assets/jss/material-kit-react/tooltipsStyle.jsx";
import MiniProfile from "components/User/MiniProfile";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

function ContestantsModal({...props}) {
    const {classes, openState, closeModal, participants, maxPlayers} = props;

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
                    <Close className={classes.modalClose}/>
                </IconButton>
                Participants
            </DialogTitle>
            <DialogContent id="modal-slide-description" className={classes.modalBody}>
                <h3>
                    {participants.length} / {maxPlayers}
                </h3>
                {participants.length > 0 ? (
                    <Table>
                        <TableBody>
                            {participants.map((user, i) => (
                                <TableRow cursor="pointer" key={i + 1}>
                                    <TableCell component="th" scope="row">
                                        <MiniProfile userName={user.name} userAvatar={user.avatar}
                                                     userOrgName={user.organization.name}
                                                     userId={user.id}/>
                                    </TableCell>
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

export default withStyles(modalStyle, tooltipsStyle)(ContestantsModal);
