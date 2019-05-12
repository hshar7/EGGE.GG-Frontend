import React from "react";
import classNames from "classnames";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import Group from "@material-ui/icons/GroupRounded";
import GamePad from "@material-ui/icons/GamepadRounded";
import DateRange from "@material-ui/icons/DateRangeRounded";
import { withStyles, Chip } from "@material-ui/core";
import moment from "moment/moment";

const style = {
  avatarStyle: {
    backgroundColor: "red"
  },
  iconStyle: {
    color: "white"
  },
  chipStyle: {
    color: "white",
    margin: "1%",
    backgroundColor: "red",
    height: "40px",
    fontSize: "0.9125rem"
  },
  bottomTextStyle: {
    fontStyle: "italic"
  }
};

function Pills({ ...props }) {
  const {
    classes,
    prize,
    tokenName,
    participants,
    tourType,
    deadline,
    handleModalClickOpen
  } = props;

  return (
    <div>
      <Chip
        icon={<MonetizationOn className={classes.iconStyle} />}
        variant="outlined"
        label={
          <React.Fragment>
            <div>
              {prize} {tokenName}
              <div className={classes.bottomTextStyle}>Cashprize</div>
            </div>
          </React.Fragment>
        }
        className={classNames(classes.chip, classes.chipStyle)}
        onClick={() => handleModalClickOpen("prizesModal")}
      />
      <Chip
        icon={<Group className={classes.iconStyle} />}
        variant="outlined"
        label={
          <React.Fragment>
            <div>
              {participants} contestants
              <div className={classes.bottomTextStyle}>Registered</div>
            </div>
          </React.Fragment>
        }
        className={classNames(classes.chip, classes.chipStyle)}
        onClick={() => handleModalClickOpen("contestantsModal")}
      />
      <Chip
        icon={<GamePad className={classes.iconStyle} />}
        variant="outlined"
        label={
          <React.Fragment>
            <div>
              Single Eliminiation
              <div className={classes.bottomTextStyle}>Tournament Type</div>
            </div>
          </React.Fragment>
        }
        className={classNames(classes.chip, classes.chipStyle)}
      />
      <Chip
        icon={<DateRange className={classes.iconStyle} />}
        variant="outlined"
        label={
          <React.Fragment>
            <div>
              {moment(deadline, "YYYY-MM-DDTHH:mm:ss:SSZ").toNow(true)}
              <div className={classes.bottomTextStyle}>Remaining</div>
            </div>
          </React.Fragment>
        }
        className={classNames(classes.chip, classes.chipStyle)}
      />
    </div>
  );
}

export default withStyles(style)(Pills);
