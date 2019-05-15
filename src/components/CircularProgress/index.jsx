import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress as CircularProgressCore } from "@material-ui/core";

const styles = {};

class CircularProgress extends React.Component {
  state = {
    completed: 0
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  render() {
    // const { classes } = this.props;
    return (
      <div>
        <CircularProgressCore
          variant="determinate"
          value={this.state.completed}
          color="secondary"
        />
      </div>
    );
  }
}

export default withStyles(styles)(CircularProgress);
