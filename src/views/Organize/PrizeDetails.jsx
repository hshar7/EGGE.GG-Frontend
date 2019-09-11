import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Input from "@material-ui/core/Input/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {InputAdornment} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";

function PrizeDetails({...props}) {
    const {handleSimple, prizeToken, prizeDescription, tournamentType, tokens, classes} = props;

    let tokenList = [];
    tokens.forEach(token => {
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

    return <div>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Prize Token</h5>
            </GridItem>
            <GridItem xs={8}>
                <Select
                    MenuProps={{
                        className: classes.selectMenu
                    }}
                    classes={{
                        select: classes.select
                    }}
                    value={prizeToken}
                    onChange={handleSimple}
                    inputProps={{
                        name: "prizeToken",
                        id: "prizeToken"
                    }}
                >
                    {tokenList}
                </Select>
            </GridItem>
        </GridContainer>
        {prizeToken === "other" ? (
            <GridContainer>
                <GridItem xs={4}>
                    <h5>Prize Description</h5>
                </GridItem>
                <GridItem xs={8}>
                    <Input
                        fullWidth={true}
                        multiline={true}
                        rows={5}
                        inputProps={{
                            name: "prizeDescription",
                            type: "text",
                            value: prizeDescription,
                            onChange: handleSimple,
                            required: true
                        }}
                    />
                </GridItem>
            </GridContainer>
        ) : <div>
            <GridContainer>
                <GridItem xs={4}>
                    <h5>Tournament Type</h5>
                </GridItem>
                <GridItem xs={8}>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        onChange={handleSimple}
                        value={tournamentType}
                        inputProps={{
                            name: "tournamentType",
                            id: "tournamentType"
                        }}
                    >
                        <MenuItem
                            classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                            }}
                            value="PRIZE_POOL"
                        >
                            Prize Pool
                        </MenuItem>
                        <MenuItem
                            classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                            }}
                            value="BUY_IN"
                        >
                            Buy In
                        </MenuItem>
                    </Select>
                </GridItem>
            </GridContainer>
            {tournamentType === "BUY_IN" ?
                <GridContainer>
                    <GridItem xs={4}>
                        <h5>Buy In Fee</h5>
                    </GridItem>
                    <GridItem xs={8}>
                        <CustomInput
                            inputProps={{
                                name: "buyInFee",
                                type: "text",
                                onChange: handleSimple,
                                required: true,
                                startAdornment: (
                                    <InputAdornment
                                        position="start">{tokens.find((token) => token.address === prizeToken).symbol}</InputAdornment>
                                )
                            }}
                        />
                    </GridItem>
                </GridContainer>
                : ""
            }
        </div>}
    </div>
}

export default withStyles(componentsStyle)(PrizeDetails);
