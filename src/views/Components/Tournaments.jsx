import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Redirect } from 'react-router-dom';

// sections for this page
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

class Tournaments extends React.Component {

    state = {
        tournaments: [],
        redirect: false,
        redirectId: ""
    };

    componentWillMount() {
        axios.get("http://localhost:8080/api/tournaments").then(response => {
            this.setState({...this.state.tournaments, tournaments: response.data});
        })
    }

    handleRowClick = (tourId) => {
        this.setState({redirectId: tourId});
        this.setState({redirect: true});
    };

    render() {
        const {classes, ...rest} = this.props;

        if (this.state.redirect === true) {
            return <Redirect to={'/tournament/' + this.state.redirectId} />
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Game</TableCell>
                        <TableCell align="right">Max Players</TableCell>
                        <TableCell align="right">Current Participants</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.tournaments.map(tour => (
                        <TableRow cursor="pointer" key={tour.id} onClick={() => this.handleRowClick(tour.id)}>
                            <TableCell component="th" scope="row">
                                {tour.name}
                            </TableCell>
                            <TableCell align="right">{tour.game ? tour.game.name : ""}</TableCell>
                            <TableCell align="right">{tour.maxPlayers}</TableCell>
                            <TableCell align="right">{tour.participants ? tour.participants.length : 0}</TableCell>
                            <TableCell align="right">
                                {tour.status ? tour.status : (tour.participants && tour.participants.length >= tour.maxPlayers ? "LIVE" : "NEW")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default withStyles(componentsStyle)(Tournaments);
