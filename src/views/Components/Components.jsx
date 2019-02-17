import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

// sections for this page
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import Tournaments from "./Tournaments";
import axios from "axios";
import assist from 'bnc-assist';

class Components extends React.Component {

    assistInstance = null;

    componentWillMount() {
        let bncAssistConfig = {
            dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
            networkId: 4
        };

        this.assistInstance = assist.init(bncAssistConfig);
    }

    componentDidMount() {
        this.assistInstance.onboard()
            .then(() => {
                this.assistInstance.getState().then(state => {
                    axios.post('http://localhost:8080/api/user', {
                        accountAddress: state.accountAddress
                    })
                })
            })
            .catch(error => {
                console.log('error');
                console.log(error);
            });
    }

    render() {
        const {classes, ...rest} = this.props;
        return (
            <div>
                <Header
                    brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"}/>}
                    rightLinks={<HeaderLinks/>}
                    leftLinks={<LeftHeaderLinks/>}
                    fixed
                    color="white"
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />
                <Parallax image={require("assets/img/jugg.jpg")}>
                    <div className={classes.container}>
                        <GridContainer>
                            <GridItem>
                                <div className={classes.brand}>
                                    <h1 className={classes.title}>Egge.gg</h1>
                                    <h3 className={classes.subtitle}>
                                        Next level eSports tournaments
                                    </h3>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </div>
                </Parallax>

                <div className={classNames(classes.main, classes.mainRaised)}>
                    <Tournaments/>
                </div>
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Components);
