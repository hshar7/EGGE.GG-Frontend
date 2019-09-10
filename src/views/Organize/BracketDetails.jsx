import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Input from "@material-ui/core/Input/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function BracketDetails({...props}) {
    const {handleSimple, format, bracketType, classes} = props;

    return <div>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Format</h5>
            </GridItem>
            <GridItem xs={8}>
                <Select
                    MenuProps={{
                        className: classes.selectMenu
                    }}
                    classes={{
                        select: classes.select
                    }}
                    value={format}
                    inputProps={{
                        name: "format",
                        id: "format"
                    }}
                >
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value="SINGLES"
                    >
                        Singles (1v1)
                    </MenuItem>
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value="TEAMS"
                    >
                        Teams (Not Yet Available)
                    </MenuItem>
                </Select>
            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Bracket Type</h5>
            </GridItem>
            <GridItem xs={8}>
                <Select
                    MenuProps={{
                        className: classes.selectMenu
                    }}
                    classes={{
                        select: classes.select
                    }}
                    value={bracketType}
                    inputProps={{
                        name: "bracketType",
                        id: "bracketType"
                    }}
                    onChange={handleSimple}
                >
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value="SINGLE_ELIMINATION"
                    >
                        Single Elimination
                    </MenuItem>
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value="BATTLE_ROYALE"
                    >
                        Battle Royale
                    </MenuItem>
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value="DOUBLE_ELIMINATION"
                    >
                        Double Elimination (Not Yet Available)
                    </MenuItem>
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value="ROUND_ROBIN"
                    >
                        Round Robin (Not Yet Available)
                    </MenuItem>
                </Select>
            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Max Players</h5>
            </GridItem>
            <GridItem xs={8}>
                <Input
                    inputProps={{
                        name: "maxPlayers",
                        type: "number",
                        onChange: handleSimple,
                        required: true
                    }}
                />
            </GridItem>
        </GridContainer>
    </div>
}

export default withStyles(componentsStyle)(BracketDetails);
