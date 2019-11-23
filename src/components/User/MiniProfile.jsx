import React from "react";
import {withStyles, Popover, Typography} from "@material-ui/core";

const styles = theme => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing.unit,
    },
});

class MiniProfile extends React.Component {
    state = {
        anchorEl: null
    };

    handlePopoverOpen = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handlePopoverClose = () => {
        this.setState({anchorEl: null});
    };

    render = () => {
        const {userName, userAvatar, userOrgName, classes} = this.props;
        const open = Boolean(this.state.anchorEl);

        return (
            <div>
                <Typography
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={this.handlePopoverOpen}
                    onMouseLeave={this.handlePopoverClose}
                    style={{
                        backgroundColor: "black",
                        borderRadius: "0.75rem",
                        maxWidth: "10rem",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        cursor: "pointer"
                    }}
                >
                    <img src={userAvatar} alt={userName}
                         style={{marginRight: "0.5rem", verticalAlign: "bottom", height: "2rem", width: "1.8rem"}}/>
                    <span style={{color: "white", verticalAlign: "middle", whiteSpace: "nowrap"}}>{userName}</span>
                </Typography>
                <Popover
                    id="mouse-over-popover"
                    className={classes.popover}
                    classes={{
                        paper: classes.paper,
                    }}
                    open={open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={this.handlePopoverClose}
                    disableRestoreFocus
                >
                    <div>
                        <img style={{borderRadius: "0.75rem", marginRight: "0.5rem", verticalAlign: "bottom", height: "5rem", width: "4.5rem"}}
                             src={userAvatar} alt={userName}/>
                        <div style={{
                            verticalAlign: "middle",
                            whiteSpace: "nowrap"
                        }}><p>{userName}</p><p>{userOrgName}</p></div>
                    </div>
                </Popover>
            </div>
        )
    }
}

export default withStyles(styles)(MiniProfile);
