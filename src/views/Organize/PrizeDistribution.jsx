import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Paper} from "@material-ui/core";
import Table from '@material-ui/core/Table/index';
import TableHead from '@material-ui/core/TableHead/index';
import TableBody from '@material-ui/core/TableBody/index';
import TableCell from '@material-ui/core/TableCell/index';
import TableRow from '@material-ui/core/TableRow/index';
import Input from "@material-ui/core/Input/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

function PrizeDistribution({...props}) {
    let maxPlayers = props.bracketType === 'SINGLE_ELIMINATION' ? 2 : props.maxPlayers;
    let cells = [];
    for (let i = 0; i < maxPlayers; i++) {
        cells.push(
            <TableRow cursor="pointer" key={i}>
                <TableCell component="th" scope="row">{i + 1}</TableCell>
                <TableCell><Input
                    inputProps={{
                        name: i,
                        type: "number",
                        onChange: props.handlePrize,
                        placeholder: 0,
                        required: true
                    }}
                /></TableCell>
            </TableRow>
        )
    }

    return (
        props.maxPlayers > 0 ?
            <GridContainer justify="center">
                <GridItem xs={12} xl={4} lg={4}>
                    <Paper style={{ height: 400, width: '100%', overflow: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Player Position</TableCell>
                                    <TableCell>Prize Percentage</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cells}
                            </TableBody>
                        </Table>
                    </Paper>
                </GridItem>
            </GridContainer>
            : <div/>
    );
}

export default withStyles(componentsStyle)(PrizeDistribution);
