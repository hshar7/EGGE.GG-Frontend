import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Input from "@material-ui/core/Input/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

function BracketDetails({...props}) {
    const {handleSimple, handlePointsDistribution, maxPlayers, format, bracketType, classes} = props;
    let cells = [];
    for (let i = 0; i < maxPlayers; i++) {
        cells.push(
            <TableRow cursor="pointer" key={i}>
                <TableCell component="th" scope="row">{i + 1}</TableCell>
                <TableCell><Input
                    inputProps={{
                        name: i,
                        type: "number",
                        onChange: handlePointsDistribution,
                        placeholder: 0,
                        required: true
                    }}
                /></TableCell>
            </TableRow>
        )
    }
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
        {bracketType === "BATTLE_ROYALE" ?
            <div>
                <GridContainer>
                    <GridItem xs={4}>
                        <h5>Rounds</h5>
                    </GridItem>
                    <GridItem xs={8}>
                        <Input
                            inputProps={{
                                name: "rounds",
                                type: "number",
                                onChange: handleSimple,
                                required: true
                            }}
                        />
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={4}>
                        <h5>Points to Win</h5>
                    </GridItem>
                    <GridItem xs={8}>
                        <Input
                            inputProps={{
                                name: "pointsToWin",
                                type: "number",
                                onChange: handleSimple,
                                required: true
                            }}
                        />
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={8}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Player Position</TableCell>
                                    <TableCell>Points Awarded Per Round</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cells}
                            </TableBody>
                        </Table>
                    </GridItem>
                </GridContainer>
            </div>
            : <div/>}
    </div>
}

export default withStyles(componentsStyle)(BracketDetails);
