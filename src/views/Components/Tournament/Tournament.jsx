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
import Button from "components/CustomButtons/Button";
import { withStyles, CardMedia } from "@material-ui/core";
import Pills from "./Pills.jsx";
import abi from "abis/tournamentAbi";
import humanStandardTokenAbi from "abis/humanStandardToken";
import { bn_id, contract_address } from "constants.js";
import { onboardUser, sleep, apolloClient } from "utils";
import { PICK_WINNER, ADD_PARTICIPANT, GET_TOURNAMENT } from "./graphs";
import "../App.css";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import PrizesModal from "./PrizesModal";
import ContestantsModal from "./ContestantsModal";
import ContributeModal from "./ContributeModal";
import ParticipateModal from "./ParticipateModal";
import axios from "axios";
import { base } from "constants.js";

class Tournament extends React.Component {
  state = {
    id: null,
    tournament: {},
    maxPlayers: 0,
    participants: [],
    matches: {},
    redirect: false,
    redirectPath: "",
    user: {},
    owner: {},
    web3: null,
    assistInstance: null,
    contract: null,
    decoratedContract: null,
    tokenName: "ETH",
    tokenVersion: 0,
    contribution: 0,
    tokenUsdPrice: 0,
    prize: 0,
    deadline: 0,
    title: "",
    prizesModal: false,
    contestantsModal: false,
    contributeModal: false,
    participateModal: false,
    coverImage: ""
  };

  handleModalClickOpen = modal => {
    var x = [];
    x[modal] = true;
    this.setState(x);
  };

  handleModalClose = modal => {
    var x = [];
    x[modal] = false;
    this.setState(x);
  };

  handleFiles = e => {
    console.log(e.target.files);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios
      .post(`${base}/tournament/${this.state.id}/coverImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        sleep(3000).then(() => {
          this.setState({ coverImage: response.data.fileUrl });
        });
      });
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
        this.setState({ coverImage: data.tournament.coverImage });
        this.setState({ owner: data.tournament.owner });
        this.setState({ maxPlayers: data.tournament.maxPlayers });
        this.setState({ title: data.tournament.name });
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
        <GridContainer xs={12} style={{ marginRight: "2%", marginLeft: "2%" }}>
          <GridItem xs={12} md={8} lg={10} xl={10}>
            <h2>{this.state.title}</h2>
            <h4>
              Organized By{" "}
              {this.state.tournament.owner ? (
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
              handleModalClickOpen={this.handleModalClickOpen}
            />
          </GridItem>
          <GridItem xs={12} md={4} lg={2} xl={2}>
            <Card plain={true} style={{ marginLeft: "1%", marginRight: "1%" }}>
              <Button
                style={{ backgroundColor: "green", borderRadius: "0.5rem" }}
                onClick={() => this.handleModalClickOpen("contributeModal")}
              >
                Contribute To Prize Pool
              </Button>
              <Button
                style={{ backgroundColor: "black", borderRadius: "0.5rem" }}
                onClick={() => this.handleModalClickOpen("participateModal")}
                disabled={
                  this.state.participants.length < this.state.maxPlayers
                    ? false
                    : true
                }
              >
                Join As A Contestant
              </Button>
              <Button
                color="transparent"
                style={{ color: "black", fontWeight: "bold" }}
              >
                Contact organizer
              </Button>
            </Card>
          </GridItem>
          <GridItem xs={12} md={12} lg={12} xl={12}>
            <Card
              plain={true}
              style={{ marginTop: "-1.5rem", position: "relative" }}
            >
              <CardMedia
                image={this.state.coverImage}
                style={{
                  borderRadius: "0.5rem",
                  paddingTop: "25%",
                  minHeight: "10rem"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "15px",
                  color: "white",
                  backgroundColor: "transparent",
                  fontSize: "x-large"
                }}
              >
                {this.state.owner.id === localStorage.getItem("userId") ? (
                  <div>
                    <input
                      accept="image/*"
                      className={classes.input}
                      style={{ display: "none" }}
                      id="raised-button-file"
                      multiple
                      onChange={this.handleFiles}
                      type="file"
                    />
                    <label htmlFor="raised-button-file">
                      <Button
                        variant="raised"
                        component="span"
                        className={classes.button}
                      >
                        Change Cover
                      </Button>
                    </label>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Card>
          </GridItem>
          <GridItem xs={12} style={{ marginTop: "-2rem" }}>
            <Card plain={true}>
              <h4>
                {this.state.tournament ? this.state.tournament.description : ""}
              </h4>
            </Card>
          </GridItem>
          <GridItem xs={12}>
            {this.state.tournament &&
            this.state.participants.length >= this.state.maxPlayers ? (
              <Card>
                <main id="tournament">{bracketElements}</main>
              </Card>
            ) : null}
          </GridItem>
        </GridContainer>
        <PrizesModal
          openState={this.state.prizesModal}
          closeModal={this.handleModalClose}
          tournament={this.state.tournament}
        />
        <ContestantsModal
          openState={this.state.contestantsModal}
          closeModal={this.handleModalClose}
          participants={this.state.participants}
          maxPlayers={this.state.maxPlayers}
        />
        <ContributeModal
          openState={this.state.contributeModal}
          closeModal={this.handleModalClose}
          tokenName={this.state.tokenName}
          handleSimple={this.handleSimple}
          handleFunding={this.handleFunding}
        />
        <ParticipateModal
          openState={this.state.participateModal}
          closeModal={this.handleModalClose}
          tournamentId={this.state.id}
          userId={this.state.user ? this.state.user.id : null}
          handleUserRegister={this.handleUserRegister}
        />
        {this.renderRedirect()}
      </div>
    );
  }
}

export default withStyles(componentsStyle)(Tournament);
