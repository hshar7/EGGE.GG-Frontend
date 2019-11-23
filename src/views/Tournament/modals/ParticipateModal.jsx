import React, {useState, useEffect} from "react";
import {
    withStyles, Slide,
    Dialog, DialogTitle, DialogContent,
    IconButton, TableCell, TableRow, TableBody, Table
} from "@material-ui/core";
import Card from "components/Card/Card";
import Close from "@material-ui/icons/Close";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";
import {apolloClient} from "../../../utils";
import gql from "graphql-tag";
import TableHead from "@material-ui/core/TableHead";
import Button from "components/CustomButtons/Button";

const GET_MY_OWNED_TEAMS = gql`{
    getMyOwnedTeams {
        id
        name
        members {
            id
            name
        }
    }
}`;

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

function ParticipateModal({...props}) {
    const {
        classes,
        closeModal,
        history,
        openState,
        teamSize
    } = props;

    const [teams, setTeams] = useState([]);
    useEffect(() => {
        apolloClient.query({query: GET_MY_OWNED_TEAMS, fetchPolicy: 'network-only'}).then(res => {
            const data = res.data.getMyOwnedTeams;

            const newTeams = [];
            data.forEach((team, i) => {
                newTeams.push(<TableRow cursor="pointer" key={i + 1}>
                    <TableCell component="th" scope="row">
                        {team.name}
                    </TableCell>
                    <TableCell>
                        {team.members.length}
                    </TableCell>
                    <TableCell>
                        {team.members.length === teamSize ? <Button size="sm" color="success">Enroll</Button> : <Button size="sm" color="warning" onClick={() => history.push(`/modifyTeam/${team.id}`)}>Modify</Button>}
                    </TableCell>
                </TableRow>);
            });
            setTeams(newTeams);
        });
    }, [openState]);

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
                    <Close className={classes.modalClose}/>
                </IconButton>
                Join This Tournament
            </DialogTitle>
            <DialogContent id="modal-slide-description" className={classes.modalBody}>
                <Card plain={true} style={{textAlign: "center"}}>
                    <h3>Create or pick a team</h3>
                    <h5>Tournament required team size: {teamSize}</h5>
                </Card>
                <Card plain={true}>
                    <Table>
                        <TableHead>
                            <TableCell>Team Name</TableCell>
                            <TableCell>Team Size</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableHead>
                        <TableBody>
                            {teams}
                        </TableBody>
                    </Table>
                </Card>
                <div style={{textAlign: "center"}}>
                <Button style={{backgroundColor: "green", color: "white"}} onClick={() => history.push("/newTeam")}>
                    Create new team
                </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default withStyles(modalStyle)(ParticipateModal);
