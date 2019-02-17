import React, {Component} from 'react';
import './App.css';

class Bracket extends Component {

    render() {
        let elements = [];
        if (this.props.matches) {
            this.props.matches.forEach(match => {
                elements.push(<li className="spacer">&nbsp;</li>);
                elements.push(<li className="game game-top"> {match.player1} </li>);
                elements.push(<li className="game game-spacer"> &nbsp;</li>);
                elements.push(<li className="game game-bottom "> {match.player2} </li>);
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
