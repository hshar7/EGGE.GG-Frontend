// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Input from "@material-ui/core/Input";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
// core components
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import assist from "bnc-assist";
import Header from "components/Header/Header.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Web3 from "web3";
import abi from "../../abis/tournamentAbi";
import IPFS from "ipfs-mini";
import PrizeDistribution from "./PrizeDistribution";
import { onboardUser } from "../../utils/";
import { base, contract_address, bn_id } from "../../constants";
import axios from "axios";

class Organize extends React.Component {
  state = {
    user: null,
    web3: null,
    assistInstance: null,
    contract: null,
    decoratedContract: null,
    prizeDistribution: [],
    maxPlayers: 0,
    prizeToken: "0x0000000000000000000000000000000000000000",
    type: "singles",
    bracketType: "se",
    prizeDescription: "This is just for fun, no prizes!",
    enrollmentType: "freeEntry",
    tokens: []
  };

  componentDidMount() {
    this.setState({ web3: new Web3(window.web3.currentProvider) });
    let bncAssistConfig = {
      dappId: bn_id,
      networkId: 4,
      web3: this.state.web3,
      messages: {
        txPending: () => {
          return `Creating ${this.state.title}.`;
        },
        txConfirmed: () => {
          return `Created ${this.state.title} Successfully.`;
        }
      }
    };
    this.setState({ assistInstance: assist.init(bncAssistConfig) }, () => {
      onboardUser(this.state.assistInstance, this.setState).then(
        responseData => {
          this.setState({ ...this.state.user, user: responseData });
        }
      );
    });
    axios.get(`${base}/tokens`).then(response => {
      this.setState({ tokens: response.data });
    });
  }

  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDate = event => {
    this.setState({ deadline: event.valueOf() }); // TODO: Resolve time zones
  };

  handlePrize = event => {
    const prizeDistribution = this.state.prizeDistribution;
    prizeDistribution[Number(event.target.name)] = Number(event.target.value);
    this.setState({ prizeDistribution: prizeDistribution });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSubmit = event => {
    event.preventDefault();

    const tokenVersion =
      this.state.prizeToken === "0x0000000000000000000000000000000000000000"
        ? 0
        : 20;

    // Fix up size of distribution type
    const prizeDistribution = this.state.prizeDistribution;
    for (let i = 0; i < this.state.maxPlayers; i++) {
      if (prizeDistribution[i] === undefined) {
        prizeDistribution[i] = 0;
      }
    }
    this.setState({ prizeDistribution: prizeDistribution });

    if (this.state.prizeToken === "other") {
      window.alert("Working on it!");
    } else {
      const ipfs = new IPFS({
        host: "ipfs.infura.io",
        port: "5001",
        protocol: "https"
      });
      ipfs.addJSON(
        {
          name: this.state.title,
          description: this.state.description,
          game: this.state.game,
          userId: this.state.user.id
        },
        (err, result) => {
          if (result) {
            console.log(this.state);
            this.setState(
              {
                contract: this.state.web3.eth.contract(abi).at(contract_address)
              },
              () => {
                this.setState(
                  {
                    decoratedContract: this.state.assistInstance.Contract(
                      this.state.contract
                    )
                  },
                  () => {
                    this.state.decoratedContract.newTournament(
                      this.state.user.publicAddress,
                      result,
                      this.state.deadline,
                      this.state.prizeToken,
                      tokenVersion,
                      this.state.maxPlayers,
                      this.state.prizeDistribution,
                      { from: this.state.user.publicAddress }
                    );
                  }
                );
              }
            );
          } else {
            console.log({ err });
          }
        }
      );
    }
  };

  render() {
    const { classes, ...rest } = this.props;

    let tokenList = [];
    this.state.tokens.forEach(token => {
      tokenList.push(
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={token.address}
        >
          {token.symbol}
        </MenuItem>
      );
    });
    tokenList.push(
      <MenuItem
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value="other"
      >
        Other
      </MenuItem>
    );

    return (
      <div>
        <Header
          brand={<img src={require("assets/img/logo.svg")} alt="egge.gg" />}
          rightLinks={<HeaderLinks />}
          leftLinks={<LeftHeaderLinks />}
          fixed
          color="white"
          {...rest}
        />
        <GridContainer xs={10}>
          <GridItem>
            <Card plain={true}>
              <CardHeader>
                <h2 className={classes.cardTitle}>Create a tournament</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={this.handleSubmit}>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Title</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        fullWidth={true}
                        inputProps={{
                          name: "title",
                          type: "text",
                          onChange: this.handleSimple,
                          required: true,
                          autoFocus: true
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Description</h5>
                    </GridItem>
                    <GridItem xs={10}>
                      <Input
                        fullWidth={true}
                        multiline={true}
                        rows={5}
                        inputProps={{
                          name: "description",
                          type: "text",
                          onChange: this.handleSimple,
                          required: true
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <br />
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Max Players</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        inputProps={{
                          name: "maxPlayers",
                          type: "number",
                          onChange: this.handleSimple,
                          required: true
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Start Time</h5>
                    </GridItem>
                    <GridItem xs={10}>
                      <FormControl fullWidth={false}>
                        <Datetime
                          onChange={this.handleDate}
                          inputProps={{
                            name: "deadline",
                            required: true
                          }}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Game</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        inputProps={{
                          name: "game",
                          type: "text",
                          onChange: this.handleSimple,
                          required: true
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Bracket Type</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.bracketType}
                        inputProps={{
                          name: "bracketType",
                          id: "bracketType"
                        }}
                      >
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="se"
                        >
                          Single Elimination
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="de"
                        >
                          Double Elimination
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="rr"
                        >
                          Round Robin
                        </MenuItem>
                      </Select>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Format</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.type}
                        inputProps={{
                          name: "type",
                          id: "type"
                        }}
                      >
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="singles"
                        >
                          Singles (1v1)
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="de"
                        >
                          Teams
                        </MenuItem>
                      </Select>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Prize Token</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.prizeToken}
                        onChange={this.handleSimple}
                        inputProps={{
                          name: "prizeToken",
                          id: "prizeToken"
                        }}
                      >
                        {tokenList}
                      </Select>
                    </GridItem>
                  </GridContainer>
                  {this.state.prizeToken === "other" ? (
                    <GridContainer>
                      <GridItem xs={2}>
                        <h5>Prize Description</h5>
                      </GridItem>
                      <GridItem xs={10}>
                        <Input
                          fullWidth={true}
                          multiline={true}
                          rows={5}
                          inputProps={{
                            name: "prizeDescription",
                            type: "text",
                            value: this.state.prizeDescription,
                            onChange: this.handleSimple,
                            required: true
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  ) : (
                    <GridContainer>
                      <GridItem xs={2}>
                        <h5>Enrollment Type</h5>
                      </GridItem>
                      <GridItem xs={10}>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.enrollmentType}
                          inputProps={{
                            name: "enrollmentType",
                            id: "enrollmentType"
                          }}
                        >
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="freeEntry"
                          >
                            Free Enrollement
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="buyIn"
                          >
                            Buy In
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="inviteOnly"
                          >
                            Invite Only
                          </MenuItem>
                        </Select>
                      </GridItem>
                    </GridContainer>
                  )}
                  <PrizeDistribution
                    maxPlayers={this.state.maxPlayers}
                    handlePrize={this.handlePrize}
                    bracketType={this.state.bracketType}
                  />
                  <br />
                  <br />
                  <GridContainer justify="center">
                    <GridItem xs={2}>
                      <Button
                        type="primary"
                        htmltype="submit"
                        color="success"
                        size="sm"
                        block
                      >
                        Submit
                      </Button>
                    </GridItem>
                  </GridContainer>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(componentsStyle)(Organize);
