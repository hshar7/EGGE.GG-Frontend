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
import Pills from "./Pills.jsx";
import abi from "abis/tournamentAbi";
import humanStandardTokenAbi from "abis/humanStandardToken";
import { bn_id, contract_address } from "constants.js";
import { onboardUser, sleep, apolloClient } from "utils";
import { PICK_WINNER, ADD_PARTICIPANT, GET_TOURNAMENT } from "./graphs";
import "../App.css";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

class Tournament extends React.Component {
  state = {
    id: null,
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
    tokenUsdPrice: 0,
    prize: 0,
    deadline: 0
  };

  componentDidMount = () => {
    this.setState({ id: this.props.match.params.id });
    this.getTournament(this.props.match.params.id);
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
                this.getTournament(this.props.match.params.id);
                return "Winners successfully paid.";
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
  };

  getTournament = id => {
    apolloClient
      .query({
        query: GET_TOURNAMENT(id)
      })
      .then(response => {
        if (response.loading) return "Loading...";
        if (response.error) return `Error!`;
        const data = response.data;
        this.setState({
          ...this.state.tournament,
          tournament: data.tournament
        });
        this.setState({ tokenName: data.tournament.token.symbol });
        this.setState({ tokenVersion: data.tournament.token.tokenVersion });
        this.setState({ maxPlayers: data.tournament.maxPlayers });
        this.setState({
          ...this.state.participants,
          participants: data.tournament.participants
        });
        this.setState({
          ...this.state.matches,
          matches: data.tournament.matches
        });
        this.setState({ tokenUsdPrice: data.tournament.token.usdPrice });
        this.setState({ prize: data.tournament.prize });
        this.setState({ deadline: data.tournament.deadline });
        return null;
      });
  };

  handleUserRegister = (tournamentId, userId) => {
    apolloClient
      .mutate({
        variables: { tournamentId: tournamentId, userId: userId },
        mutation: ADD_PARTICIPANT
      })
      .then(response => {
        if (response.loading) return "Loading...";
        if (response.error) return `Error!`;

        const tournament = response.data.addParticipant;
        this.setState({
          ...this.state.tournament,
          tournament: tournament
        });
        this.setState({
          ...this.state.participants,
          participants: tournament.participants
        });
        this.setState({
          ...this.state.matches,
          matches: tournament.matches
        });
        return null;
      });
  };

  handleWinner = (matchId, num, final) => {
    if (final) {
      this.handlePayment(num);
    } else {
      apolloClient
        .mutate({
          variables: { pos: Number(num), matchId: matchId },
          mutation: PICK_WINNER
        })
        .then(response => {
          this.setState({
            ...this.state.matches,
            matches: response.data.matchWinner
          });
        });
    }
  };

  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectPath} />;
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
        let finalMatch = this.state.matches[
          Object.keys(this.state.matches).length - 1
        ];

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
    Object.entries(this.state.matches).forEach(([key, match]) => {
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
        <GridContainer
          xs={12}
          style={{ marginRight: "3rem", marginLeft: "3rem" }}
        >
          <GridItem xs={10}>
            <h2>{this.state.tournament ? this.state.tournament.name : ""}</h2>
            <h4>
              Organized By{" "}
              {this.state.tournament &&
              this.state.tournament.owner.organization ? (
                <span>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {this.state.tournament.owner.organization}
                  </span>
                  <span>{" | Game: "}</span>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {this.state.tournament.game.name}
                  </span>
                </span>
              ) : (
                ""
              )}
            </h4>
            <Pills
              prize={this.state.prize}
              tokenName={this.state.tokenName}
              participants={this.state.participants.length}
              deadline={this.state.deadline}
            />
          </GridItem>
          <GridItem xs={10} md={5} lg={2} xl={2}>
            <Card plain={true} style={{ marginTop: "7rem" }}>
              <Button
                style={{ backgroundColor: "black", borderRadius: "0.5rem" }}
                onClick={() =>
                  this.handleUserRegister(this.state.id, this.state.user.id)
                }
              >
                Register now
              </Button>
              <Button color="transparent" style={{ color: "black" }}>
                Contact organizer
              </Button>
            </Card>
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
                borderWidth: "0px 0px 0px 1px",
                borderStyle: "solid"
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
                  onClick={() =>
                    this.handleUserRegister(this.state.id, this.state.user.id)
                  }
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
