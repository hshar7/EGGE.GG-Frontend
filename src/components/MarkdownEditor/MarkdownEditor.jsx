import * as React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

export default class MarkdownEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tab: "write"
        };
        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true
        });
    }

    handleTabChange = (tab) => {
        this.setState({tab})
    };

    render () {
        return (
            <div className="container">
                <ReactMde
                    onChange={this.props.handleTextChange}
                    onTabChange={this.handleTabChange}
                    value={this.props.text}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(this.converter.makeHtml(markdown))
                    }
                    selectedTab={this.state.tab}
                />
            </div>
        );
    }
}
