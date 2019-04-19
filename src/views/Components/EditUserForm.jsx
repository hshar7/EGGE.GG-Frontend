import FormLabel from "@material-ui/core/FormLabel";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import { Redirect } from "react-router-dom";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import axios from "axios";
import assist from "bnc-assist";
import Input from "@material-ui/core/Input";
import Header from "components/Header/Header.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import { base } from "../../constants";
import { onboardUser } from "../../utils/";

function isEmpty(str) {
  return !str || 0 === str.length;
}

class Organize extends React.Component {
  state = {
    redirect: false,
    redirectPath: "",
    user: null,
    name: "",
    email: "",
    organization: "",
    publicAddress: ""
  };
  assistInstance = null;

  componentWillMount() {
    let bncAssistConfig = {
      dappId: "cae96417-0f06-4935-864d-2d5f99e7d40f",
      networkId: 4
    };

    this.assistInstance = assist.init(bncAssistConfig);
  }

  componentDidMount() {
    this.assistInstance
      .onboard()
      .then(() => {
        this.assistInstance.getState().then(state => {
          axios
            .post(`${base}/user`, {
              accountAddress: state.accountAddress
            })
            .then(response => {
              this.setState({ ...this.state.user, user: response.data });
              this.setState({ name: response.data.name });
              this.setState({ email: response.data.email });
              this.setState({ organization: response.data.organization });
              this.setState({ publicAddress: state.accountAddress });
            });
        });
      })
      .catch(error => {
        console.log({ error });
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
  handleSubmit = event => {
    event.preventDefault();
    axios
      .post(`${base}/user/${this.state.user.id}/metadata`, {
        name: this.state.name,
        email: this.state.email,
        organization: this.state.organization
      })
      .then(() => {
        this.setState({ redirectPath: "/" });
        this.setState({ redirect: true });
      });
  };

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
          brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"} />}
          rightLinks={<HeaderLinks />}
          leftLinks={<LeftHeaderLinks />}
          fixed
          color="white"
          {...rest}
        />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <GridContainer>
          <GridItem spacing={10}>
            <Card>
              <CardHeader>
                <h2 className={classes.cardTitle}>Edit User</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={this.handleSubmit}>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Public Address</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        inputProps={{
                          disabled: true,
                          name: "publicAddress",
                          value: this.state.publicAddress
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Name</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        inputProps={{
                          name: "name",
                          type: "text",
                          onChange: this.handleSimple,
                          required: true,
                          autoFocus: true,
                          value: this.state.name
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Email</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        inputProps={{
                          name: "email",
                          type: "email",
                          onChange: this.handleSimple,
                          required: true,
                          value: this.state.email
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={2}>
                      <h5>Organization</h5>
                    </GridItem>
                    <GridItem xs={5}>
                      <Input
                        inputProps={{
                          name: "organization",
                          type: "text",
                          onChange: this.handleSimple,
                          required: true,
                          value: this.state.organization
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="align-left">
                    <GridItem xs={2}>
                      <Button
                        type="primary"
                        color="success"
                        htmltype="submit"
                        size="lg"
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
          {this.renderRedirect()}
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(componentsStyle)(Organize);
