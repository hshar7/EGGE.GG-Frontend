import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Input from "@material-ui/core/Input/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import MarkdownEditor from "../../components/MarkdownEditor/MarkdownEditor";
import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function BasicDetails({...props}) {
    const {handleSimple, handleTextBox, handleDate, description, game, games, classes} = props;

    return <div>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Tournament Name</h5>
            </GridItem>
            <GridItem xs={8}>
                <Input
                    fullWidth={true}
                    inputProps={{
                        name: "title",
                        type: "text",
                        onChange: handleSimple,
                        required: true,
                        autoFocus: true
                    }}
                />
            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Description</h5>
            </GridItem>
            <GridItem xs={8}>
                <MarkdownEditor text={description}
                                handleTextChange={handleTextBox}/>
            </GridItem>
        </GridContainer>
        <br/>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Start Time</h5>
            </GridItem>
            <GridItem xs={8}>
                <FormControl fullWidth={false}>
                    <Datetime
                        onChange={handleDate}
                        inputProps={{
                            autoComplete: "off",
                            name: "deadline",
                            required: true
                        }}
                    />
                </FormControl>
            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem xs={4}>
                <h5>Game</h5>
            </GridItem>
            <GridItem xs={8}>
                <Select
                    MenuProps={{
                        className: classes.selectMenu
                    }}
                    classes={{
                        select: classes.select
                    }}
                    onChange={handleSimple}
                    value={game}
                    inputProps={{
                        name: "game",
                        id: "game"
                    }}
                >
                    {games.map(game => {
                        return <MenuItem
                            classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                            }}
                            value={game.name}
                        >
                            {game.name}
                        </MenuItem>
                    })}
                </Select>
            </GridItem>
        </GridContainer>
    </div>
}

export default withStyles(componentsStyle)(BasicDetails);
