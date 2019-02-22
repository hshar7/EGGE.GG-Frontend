import React, {Component} from 'react';
import './App.css';

let hidden = {
    display: "none"
};

class Bracket extends Component {


    render() {
        let elements = [];
        if (this.props.matches) {
            this.props.matches.forEach(match => {
                elements.push(<hidden style={hidden}>{match.matchKey}</hidden>);
                elements.push(<li className="spacer">&nbsp;</li>);
                if (match.winner) {
                    if (match.winner.name === match.player1) {
                        elements.push(<li className="game game-top winner"> {match.player1} </li>);
                        elements.push(<li className="game game-spacer"> &nbsp;</li>);
                        elements.push(<li className="game game-top"> {match.player2} </li>)
                    } else {
                        elements.push(<li className="game game-top"> {match.player1} </li>);
                        elements.push(<li className="game game-spacer"> &nbsp;</li>);
                        elements.push(<li className="game game-top winner"> {match.player2} </li>)
                    }
                } else {
                    elements.push(<li onClick={() => this.props.winner1(match.matchId)} className="game game-top"> {match.player1} </li>);
                    elements.push(<li className="game game-spacer"> &nbsp;</li>);
                    elements.push(<li onClick={() => this.props.winner2(match.matchId)} className="game game-bottom"> {match.player2} </li>);
                }
            });
        }

        return (
            <ul className={this.props.className}>
                {elements}
                <li className="spacer"> &nbsp;</li>
            </ul>
        )
    }
}

export default Bracket;
