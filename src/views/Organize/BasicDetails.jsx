import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import MarkdownEditor from "../../components/MarkdownEditor/MarkdownEditor";
import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

function BasicDetails({...props}) {
    const {handleSimple, handleTextBox, handleDate, description, game, games, classes} = props;

    return <div>
        <GridContainer>
            <GridItem xs={12}>
                <TextField
                    id="outlined-basic"
                    label="Tournament Name"
                    name="title"
                    autoFocus={true}
                    margin="normal"
                    variant="outlined"
                    fullWidth={true}
                    required={true}
                    onChange={handleSimple}
                />
            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem xs={12}>
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
                            key={game.id}
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
