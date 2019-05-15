import * as React from "react";
import * as Showdown from "showdown";

export default class MarkdownParser extends React.Component {
    constructor(props) {
        super(props);
        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true
        });
    }

    render() {
        if (this.props.text) {
            return <div dangerouslySetInnerHTML={{__html: this.converter.makeHtml(this.props.text)}}/>;
        }
        return null;
    }
}
