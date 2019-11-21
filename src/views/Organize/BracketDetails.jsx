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
import {Paper} from "@material-ui/core";

function BracketDetails({...props}) {
    const {handleSimple, handlePointsDistribution, maxPlayers, maxTeams, teamSize, bracketType, classes} = props;
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
                        placeholder: 0
                    }}
                /></TableCell>
            </TableRow>
        )
    }

    return <div>
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
                <h5>Number of teams:</h5>
            </GridItem>
            <GridItem xs={8}>
                <Select
                    MenuProps={{
                        className: classes.selectMenu
                    }}
                    classes={{
                        select: classes.select
                    }}
                    value={maxTeams}
                    inputProps={{
                        name: "maxTeams",
                        id: "maxTeams"
                    }}
                    onChange={handleSimple}
                >
                    <MenuItem classes={{root: classes.selectMenuItem, selected: classes.selectMenuItemSelected}} value={2}>2</MenuItem>
                    <MenuItem classes={{root: classes.selectMenuItem, selected: classes.selectMenuItemSelected}} value={4}>4</MenuItem>
                    <MenuItem classes={{root: classes.selectMenuItem, selected: classes.selectMenuItemSelected}} value={8}>8</MenuItem>
                    <MenuItem classes={{root: classes.selectMenuItem, selected: classes.selectMenuItemSelected}} value={16}>16</MenuItem>
                    <MenuItem classes={{root: classes.selectMenuItem, selected: classes.selectMenuItemSelected}} value={32}>32</MenuItem>
                    <MenuItem classes={{root: classes.selectMenuItem, selected: classes.selectMenuItemSelected}} value={64}>64</MenuItem>
                </Select>
            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Players per team:</h5>
            </GridItem>
            <GridItem xs={8}>
                <Input
                    inputProps={{
                        name: "teamSize",
                        type: "number",
                        onChange: handleSimple,
                        required: true,
                        value: teamSize
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
                <GridContainer justify="center">
                    <GridItem xs={12} xl={4} lg={4}>
                        <Paper style={{height: 400, width: '100%', overflow: "auto"}}>
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
                        </Paper>
                    </GridItem>
                </GridContainer>
            </div>
            : <div/>}
    </div>
}

export default withStyles(componentsStyle)(BracketDetails);
