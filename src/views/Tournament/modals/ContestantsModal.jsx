import React from "react";
import {
    withStyles,
    Slide,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";
import tooltipsStyle from "assets/jss/material-kit-react/tooltipsStyle.jsx";
import Button from "../../../components/CustomButtons/Button";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

function action(isOwner, id, removeParticipant) {
    if (!isOwner) {return null;}
    return <TableCell>
        <Button onClick={() => removeParticipant(id)} color="warning" size="sm">
            Remove
        </Button>
    </TableCell>
}

function ContestantsModal({...props}) {
    const {classes, openState, closeModal, isOwner, removeParticipant, participants, maxTeams, history} = props;

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
                    {participants.length} / {maxTeams} Registered
                </h3>
                {participants.length > 0 ? (
                    <Table>
                        <TableBody>
                            {participants.map((team, i) => (
                                <TableRow cursor="pointer" key={i + 1}>
                                    <TableCell>
                                        {i+1}
                                    </TableCell>
                                    <TableCell onClick={() => history.push("/team/" + team.id)} style={{textDecoration: "underline", cursor: "pointer"}}>
                                        {team.name}
                                    </TableCell>
                                    {action(isOwner, team.id, removeParticipant)}
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
