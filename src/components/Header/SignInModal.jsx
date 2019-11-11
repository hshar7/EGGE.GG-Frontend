import React from "react";
import {withStyles, Slide, Dialog, DialogContent} from "@material-ui/core";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem";
import Input from "@material-ui/core/Input";
import Button from "../CustomButtons/Button";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

function SignInModal({...props}) {
    const {classes, openState, closeModal, handleSimple, signIn} = props;

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
                <GridContainer justify="center">
                    <GridItem>
                        <form onSubmit={signIn}>
                            <GridContainer justify="center">
                                <GridItem xs={4}>
                                    <h5>Username</h5>
                                </GridItem>
                                <GridItem xs={6}>
                                    <Input autoFocus={true} id="username" name="username" onChange={handleSimple}
                                           type="text"/>
                                </GridItem>
                            </GridContainer>

                            <GridContainer justify="center">
                                <GridItem xs={4}>
                                    <h5>Password</h5>
                                </GridItem>
                                <GridItem xs={6}>
                                    <Input autoFocus={true} id="password" name="password" onChange={handleSimple}
                                           type="password"/>
                                </GridItem>
                            </GridContainer>

                            <GridContainer justify="center">
                                <Button color="success" type="primary" htmltype="submit"
                                        style={{marginTop: "2rem"}}>Sign In</Button>
                            </GridContainer>
                        </form>
                    </GridItem>
                </GridContainer>
            </DialogContent>
        </Dialog>
    );
}

export default withStyles(modalStyle)(SignInModal);
