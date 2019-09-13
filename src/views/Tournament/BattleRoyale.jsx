import React from 'react';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs";
import {Paper, Table, TableHead, TableBody, TableRow, TableCell, withStyles, Input} from "@material-ui/core";

function BattleRoyale({...props}) {
    const {handlePointUpdate, maxPlayers, organizer, rounds, classes} = props;

    let roundsObject = [];
    for (let i = 0; i < rounds.size; i++) {
        roundsObject.push({
            tabName: `Round ${i + 1}`,
            tabContent: assembleRoundTable(maxPlayers, organizer, rounds[i], i, handlePointUpdate)
        })
    }

    /** Overview tab **/
    let users = [];
    for (let i = 0; i < rounds.size; i++) {
        rounds[i].forEach( (user, points) => {
            const username = user.username;
            if (users[username]) {
                users[username] = users[username] + points;
            } else {
                users[username] = points;
            }
        });
    }

    let cells = [];
    let i = 0;
    users.forEach((username, points) => {
        cells.push(
            <TableRow cursor="pointer" key={i}>
                <TableCell component="th" scope="row">{username}</TableCell>
                <TableCell component="th" scope="row">{points}</TableCell>
            </TableRow>
        );
        i++;
    });
    /** Overview tab **/

    return <GridContainer>
        <GridItem xs={12}>
            <CustomTabs
                headerColor="eggeggRed"
                tabs={[
                    {
                        tabName: "Current Standings",
                        tabContent: (
                            <GridContainer justify="center">
                                <GridItem xs={12} xl={4} lg={4}>
                                    <p>Points to Win: 15</p>
                                    <Paper style={{height: 400, width: '100%', overflow: "auto"}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Player Name</TableCell>
                                                    <TableCell>Points</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cells}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </GridItem>
                            </GridContainer>
                        )
                    },
                    ...roundsObject
                ]}
            />
        </GridItem>
    </GridContainer>
}

const assembleRoundTable = (maxPlayers, organizer, round, roundNumber, handlePointUpdate) => {
    let cells = [];
    let i = 0;
    round.forEach((user, points) => {
        cells.push(
            <TableRow cursor="pointer" key={i}>
                <TableCell component="th" scope="row">{i + 1}</TableCell>
                {organizer ? <TableCell component="th" scope="row"><Input
                        inputProps={{
                            name: i,
                            type: "number",
                            onChange: () => handlePointUpdate(roundNumber, user.id),
                            placeholder: 0,
                            required: true
                        }}
                    /></TableCell>
                    : <TableCell component="th" scope="row">{user.username}</TableCell> }
                <TableCell component="th" scope="row">{points}</TableCell>
            </TableRow>
        );
        i++;
    });

    return <GridContainer justify="center">
        <GridItem xs={12} xl={4} lg={4}>
            <Paper style={{height: 400, width: '100%', overflow: "auto"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Player Position This Round</TableCell>
                            <TableCell>Player Name</TableCell>
                            <TableCell>Points Earned</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cells}
                    </TableBody>
                </Table>
            </Paper>
        </GridItem>
    </GridContainer>
};

export default withStyles(componentsStyle)(BattleRoyale);
