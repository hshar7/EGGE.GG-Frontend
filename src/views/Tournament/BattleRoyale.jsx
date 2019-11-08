import React from 'react';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs";
import {Paper, Table, TableHead, TableBody, TableRow, TableCell, withStyles, Input, Button} from "@material-ui/core";

function BattleRoyale({...props}) {
    const {handlePointUpdate, maxPlayers, organizer, rounds, participants, endRound, pointsToWin, live} = props;

    let roundsObject = [];
    for (let i = 0; i < rounds.length; i++) {
        roundsObject.push({
            tabName: `Round ${i + 1}`,
            tabContent: assembleRoundTable(maxPlayers, organizer, rounds[i], i, handlePointUpdate, participants, endRound, live)
        })
    }

    /** Overview tab **/
    let users = [];
    for (let i = 0; i < rounds.length; i++) {
        Object.entries(rounds[i]).forEach(([userId, points]) => {
            if (users[userId]) {
                users[userId] = users[userId] + points;
            } else {
                users[userId] = points;
            }
        });
    }

    let cells = [];
    let i = 0;
    Object.entries(users).forEach(([userId, points]) => {
        cells.push(
            <TableRow cursor="pointer" key={i}>
                <TableCell component="th"
                           scope="row">{participants.find(player => player.id === userId).name}</TableCell>
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
                                    <p>Points to Win: {pointsToWin}</p>
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

const assembleRoundTable = (maxPlayers, organizer, round, roundNumber, handlePointUpdate, participants, endRound, live) => {
    let cells = [];
    let i = 0;
    Object.entries(round).forEach(([userId, points]) => {
        cells.push(
            <TableRow cursor="pointer" key={i}>
                <TableCell component="th"
                           scope="row">{participants.find(player => player.id === userId).name}</TableCell>
                {organizer && live ? <TableCell component="th" scope="row"><Input
                    inputProps={{
                        name: roundNumber + "," + userId,
                        value: points,
                        type: "number",
                        onChange: handlePointUpdate,
                        placeholder: 0,
                        required: true
                    }}
                /></TableCell> : <TableCell component="th" scope="row">{points}</TableCell>}
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
        {organizer && live ?
            <Button variant="outlined" onClick={() => endRound(roundNumber)}>Finish Round</Button> : ""}
    </GridContainer>
};

export default withStyles(componentsStyle)(BattleRoyale);
