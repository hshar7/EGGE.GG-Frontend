import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Input from "@material-ui/core/Input";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

// sections for this page
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

class PrizeDistribution extends React.Component {

    render() {

        let cells = [];
        for (let i = 0; i < 2; i++) {
            cells.push(
                <TableRow cursor="pointer" key={i}>
                    <TableCell component="th" scope="row">{i}</TableCell>
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
            <GridContainer>
                <GridItem xs={8}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Player #</TableCell>
                                <TableCell>Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cells}
                        </TableBody>
                    </Table>
                </GridItem>
            </GridContainer>
        );
    }
}

export default withStyles(componentsStyle)(PrizeDistribution);
