import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from '@material-ui/core/Table/index';
import TableHead from '@material-ui/core/TableHead/index';
import TableBody from '@material-ui/core/TableBody/index';
import TableCell from '@material-ui/core/TableCell/index';
import TableRow from '@material-ui/core/TableRow/index';
import Input from "@material-ui/core/Input/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

// sections for this page
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

class PrizeDistribution extends React.Component {

    render() {
        let maxPlayers = this.props.bracketType === 'SINGLE_ELIMINATION' ? 2 : this.props.maxPlayers;
        let cells = [];
        for (let i = 0; i < maxPlayers; i++) {
            cells.push(
                <TableRow cursor="pointer" key={i}>
                    <TableCell component="th" scope="row">{i + 1}</TableCell>
                    <TableCell><Input
                        inputProps={{
                            name: i,
                            type: "number",
                            onChange: this.props.handlePrize,
                            required: true
                        }}
                    /></TableCell>
                </TableRow>
            )
        }

        return (
            this.props.maxPlayers > 0 ?
                <GridContainer>
                    <GridItem xs={8}>
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
                    </GridItem>
                </GridContainer>
                : ""
        );
    }
}

export default withStyles(componentsStyle)(PrizeDistribution);
