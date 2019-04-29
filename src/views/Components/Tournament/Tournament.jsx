import React from "react";
import { Redirect } from "react-router-dom";
import Web3 from "web3";
import assist from "bnc-assist";
import Header from "components/Header/Header.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Bracket from "./Bracket";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import Button from "components/CustomButtons/Button";
import {
  withStyles,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  InputAdornment
} from "@material-ui/core";
import abi from "abis/tournamentAbi";
import humanStandardTokenAbi from "abis/humanStandardToken";
import { base, bn_id, contract_address } from "constants.js";
import { onboardUser, sleep } from "utils";
import axios from "axios";
import "../App.css";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

class Tournament extends React.Component {
  state = {
    tournament: null,
    maxPlayers: 0,
    participants: [],
    matches: {},
    redirect: false,
    redirectPath: "",
    user: null,
    web3: null,
    assistInstance: null,
    contract: null,
    decoratedContract: null,
    tokenName: "ETH",
    tokenVersion: 0,
    contribution: 0,
    tokenUsdPrice: 0
  };

  componentDidMount() {
    axios
      .get(`${base}/tournament/` + this.props.match.params.id)
      .then(response => {
        this.setState({ ...this.state.tournament, tournament: response.data });
        this.setState({ tokenName: response.data.token.symbol });
        this.setState({ tokenVersion: response.data.token.tokenVersion });
        this.setState({ maxPlayers: response.data.maxPlayers });
        this.setState({
          ...this.state.participants,
          participants: response.data.participants
        });
        this.setState({
          ...this.state.matches,
          matches: response.data.matches
        });
        this.setState({ tokenUsdPrice: response.data.token.usdPrice });
      });
    this.setState({ web3: new Web3(window.web3.currentProvider) }, () => {
      let bncAssistConfig = {
        dappId: bn_id,
        networkId: 4,
        web3: this.state.web3,
        messages: {
          txPending: data => {
            if (data.contract.methodName === "approve") {
              return `Approving ${this.state.contribution} ${
                this.state.tokenName
              } to be contributed.`;
            } else {
              return "Transaction Pending";
            }
          },
          txConfirmed: data => {
            if (data.contract.methodName === "approve") {
              this.setState(
                {
                  decoratedContract: this.state.assistInstance.Contract(
                    this.state.web3.eth.contract(abi).at(contract_address)
                  )
                },
                () => {
                  this.state.decoratedContract.contribute(
                    this.state.tournament.tournamentId,
                    this.state.contribution,
                    {
                      from: this.state.user.publicAddress
                    },
                    (err, _) => {
                      if (!err) {
                        window.location.reload();
                      }
                    }
                  );
                }
              );
              return `${this.state.contribution} ${
                this.state.tokenName
              } approved.`;
            } else if (data.contract.methodName === "contribute") {
              sleep(5000).then(() => {
                window.location.reload();
                return "Contribution successful.";
              });
            } else if (data.contract.methodName === "payoutWinners") {
              sleep(10000).then(() => {
                axios
                  .get(`${base}/tournament/` + this.props.match.params.id)
                  .then(response => {
                    this.setState({
                      ...this.state.matches,
                      matches: response.data.matches
                    });
                    return "Winners successfully paid.";
                  });
              });
            } else {
              return "Transaction Confirmed";
            }
          }
        },
        style: {
          darkMode: true
        }
      };
      this.setState({ assistInstance: assist.init(bncAssistConfig) }, () => {
        onboardUser(this.state.assistInstance, this.setState).then(
          responseData => {
            this.setState({ ...this.state.user, user: responseData });
          }
        );
      });
    });
  }

  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectPath} />;
    }
  };

  handleUserRegister = () => {
    axios
      .post(
        `${base}/tournament/${this.state.tournament.id}/participant/${
          this.state.user.id
        }`
      )
      .then(response => {
        this.setState({ ...this.state.tournament, tournament: response.data });
        this.setState({
          ...this.state.participants,
          participants: response.data.participants
        });
        this.setState({
          ...this.state.matches,
          matches: response.data.matches
        });
      });
  };

  handleWinner = (matchId, num, final) => {
    if (final) {
      this.handlePayment(num);
    } else {
      axios.post(`${base}/match/${matchId}/winner/${num}`).then(response => {
        this.setState({ ...this.state.matches, matches: response.data });
      });
    }
  };

  handlePayment = winner => {
    this.setState(
      {
        decoratedContract: this.state.assistInstance.Contract(
          this.state.web3.eth.contract(abi).at(contract_address)
        )
      },
      () => {
        let winners = [];
        const finalIndex = this.state.matches[1].value
          ? Object.keys(this.state.matches).length
          : Object.keys(this.state.matches).length - 1;
        let finalMatch = this.state.matches[finalIndex];
        finalMatch = finalMatch.value ? finalMatch.value : finalMatch;

        if (winner === 1) {
          winners.push(finalMatch.player1.publicAddress);
          winners.push(finalMatch.player2.publicAddress);
        } else {
          winners.push(finalMatch.player2.publicAddress);
          winners.push(finalMatch.player1.publicAddress);
        }

        // This is for single eliminiation only
        for (let i = 0; i < this.state.tournament.maxPlayers - 2; i++) {
          winners.push(this.state.user.publicAddress);
        }
        this.state.decoratedContract.payoutWinners(
          this.state.tournament.tournamentId,
          winners,
          { from: this.state.user.publicAddress },
          (err, _) => {
            if (!err) {
              console.log("Contract successful");
            }
          }
        );
      }
    );
  };

  handleFunding = () => {
    if (this.state.tokenVersion === 20) {
      this.setState(
        {
          decoratedContract: this.state.assistInstance.Contract(
            this.state.web3.eth
              .contract(humanStandardTokenAbi)
              .at(this.state.tournament.token.address)
          )
        },
        () => {
          this.state.decoratedContract.approve(
            contract_address,
            this.state.contribution,
            { from: this.state.user.publicAddress }
          );
        }
      );
    } else if (this.state.tokenVersion === 0) {
      this.setState(
        {
          decoratedContract: this.state.assistInstance.Contract(
            this.state.web3.eth.contract(abi).at(contract_address)
          )
        },
        () => {
          this.state.decoratedContract.contribute.sendTransaction(
            this.state.tournament.tournamentId,
            this.state.web3.toWei(this.state.contribution, "ether"),
            {
              from: this.state.user.publicAddress,
              value: this.state.web3.toWei(this.state.contribution, "ether")
            }
          );
        }
      );
    } else {
      window.alert("Working on it!");
    }
  };

  render() {
    const { classes, ...rest } = this.props;

    let bracketElements = [];
    let matches = [];
    let bracket = 1;
    let matchCount = Object.keys(this.state.matches).length;
    let count = 0;
    Object.entries(this.state.matches).forEach(([key, value]) => {
      let match = value.value ? value.value : value; // Very hacky atm. TODO: Standardize
      if (count > matchCount / 2) {
        bracketElements.push(
          <Bracket
            key={bracket}
            winner1={matchId => this.handleWinner(matchId, 1)}
            winner2={match => this.handleWinner(match, 2)}
            matches={matches}
            className={"round round-" + bracket}
          />
        );
        bracket++;
        matchCount = matchCount - count;
        count = 0;
        matches = [];
      }
      matches.push({
        player1: match.player1 ? match.player1.name : "TBD",
        player2: match.player2 ? match.player2.name : "TBD",
        winner: match.winner ? match.winner : null,
        matchId: match.id,
        matchKey: key
      });
      count++;
    });

    // Add in final match
    bracketElements.push(
      <Bracket
        key={bracket}
        winner1={matchId => this.handleWinner(matchId, 1, true)}
        winner2={matchId => this.handleWinner(matchId, 2, true)}
        matches={matches}
        className={"round round-" + bracket}
      />
    );
    return (
      <div>
        <Header
          brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"} />}
          rightLinks={<HeaderLinks />}
          leftLinks={<LeftHeaderLinks />}
          fixed
          color="white"
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <GridContainer xs={12}>
          <GridItem xs={12}>
            <h1>{this.state.tournament ? this.state.tournament.name : ""}</h1>
            <h4>
              By{" "}
              {this.state.tournament && this.state.tournament.owner.organization
                ? this.state.tournament.owner.organization
                : ""}
            </h4>
          </GridItem>
          <GridItem xs={10}>
            <CustomTabs
              plainTabs={true}
              tabs={[
                {
                  tabName: "Overview",
                  tabContent: (
                    <GridContainer>
                      <GridItem xs={8}>
                        <h4>
                          {this.state.tournament
                            ? this.state.tournament.description
                            : ""}
                        </h4>
                      </GridItem>
                      <GridItem xs={4}>
                        <h3>
                          {this.state.tournament
                            ? this.state.tournament.game.name
                            : ""}
                        </h3>
                        <h3>
                          <img
                            src={
                              this.state.tournament
                                ? this.state.tournament.game.url
                                : ""
                            }
                            alt="game logo"
                          />
                        </h3>
                      </GridItem>
                      <GridItem xs={6}>
                        <h5>
                          Start time:{" "}
                          {this.state.tournament
                            ? new Date(
                                this.state.tournament.deadline
                              ).toLocaleString()
                            : ""}
                        </h5>
                      </GridItem>
                    </GridContainer>
                  )
                },
                {
                  tabName: "Prizes",
                  tabContent: (
                    <div>
                      <CardBody>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Place</TableCell>
                              <TableCell align="right">Percentage</TableCell>
                              <TableCell align="right">
                                In {this.state.tokenName}{" "}
                              </TableCell>
                              <TableCell align="right">In USD</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.tournament
                              ? this.state.tournament.prizeDistribution.map(
                                  (percentage, i) => (
                                    <TableRow cursor="pointer" key={i + 1}>
                                      <TableCell component="th" scope="row">
                                        {" "}
                                        {i + 1}{" "}
                                      </TableCell>
                                      <TableCell align="right">
                                        {percentage}%
                                      </TableCell>
                                      <TableCell align="right">
                                        {Number(
                                          (percentage *
                                            this.state.tournament.prize) /
                                            100
                                        ).toFixed(15)}
                                      </TableCell>
                                      <TableCell align="right">
                                        $
                                        {Number(
                                          ((percentage *
                                            this.state.tournament.prize) /
                                            100) *
                                            this.state.tokenUsdPrice
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              : ""}
                          </TableBody>
                        </Table>
                      </CardBody>
                      <hr />
                      <CardBody>
                        1 {this.state.tokenName} = ${this.state.tokenUsdPrice}
                      </CardBody>
                      <GridItem xs={2}>
                        <Card>
                          <CustomInput
                            inputProps={{
                              name: "contribution",
                              type: "number",
                              onChange: this.handleSimple,
                              required: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  {this.state.tokenName}
                                </InputAdornment>
                              )
                            }}
                          />
                          <Button
                            color="success"
                            onClick={() => this.handleFunding()}
                          >
                            Contribute
                          </Button>
                        </Card>
                      </GridItem>
                    </div>
                  )
                },
                {
                  tabName: "Participants",
                  tabContent: (
                    <CardBody>
                      <h3>
                        {this.state.participants
                          ? this.state.participants.length
                          : ""}{" "}
                        / {this.state.maxPlayers ? this.state.maxPlayers : ""}
                      </h3>
                      {this.state.participants.length > 0 ? (
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell align="right">Email</TableCell>
                              <TableCell align="right">Organization</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.participants
                              ? this.state.participants.map((user, i) => (
                                  <TableRow cursor="pointer" key={i + 1}>
                                    <TableCell component="th" scope="row">
                                      {" "}
                                      {user.name}{" "}
                                    </TableCell>
                                    <TableCell align="right">
                                      {user.email}
                                    </TableCell>
                                    <TableCell align="right">
                                      {user.organization}
                                    </TableCell>
                                  </TableRow>
                                ))
                              : ""}
                          </TableBody>
                        </Table>
                      ) : (
                        ""
                      )}
                    </CardBody>
                  )
                },
                {
                  tabName: "Brackets",
                  tabContent: (
                    <div>
                      {this.state.tournament &&
                      this.state.participants.length >=
                        this.state.maxPlayers ? (
                        <Card>
                          <CardBody>
                            <main id="tournament">{bracketElements}</main>
                          </CardBody>
                        </Card>
                      ) : null}
                    </div>
                  )
                },
                {
                  tabName: "Contact",
                  tabContent: <p />
                }
              ]}
            />
          </GridItem>
          {this.state.participants.length < this.state.maxPlayers ? (
            <GridItem
              xs={2}
              style={{
                "border-width": "0px 0px 0px 1px",
                "border-style": "solid"
              }}
            >
              <Card plain={true}>
                <center>
                  <h3>Registration Open</h3>
                </center>
              </Card>
              <Card plain={true}>
                <Button
                  color="warning"
                  onClick={() => window.open("https://metamask.io/", "_blank")}
                >
                  1. Download MetaMask
                </Button>
              </Card>
              <Card plain={true}>
                <Button
                  color="info"
                  onClick={() => window.open("/editUser", "_self")}
                >
                  2. Create an account
                </Button>
              </Card>
              <Card plain={true}>
                <Button
                  color="danger"
                  onClick={() => this.handleUserRegister()}
                >
                  3: Join Tournament
                </Button>
              </Card>
            </GridItem>
          ) : (
            ""
          )}
        </GridContainer>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default withStyles(componentsStyle)(Tournament);
