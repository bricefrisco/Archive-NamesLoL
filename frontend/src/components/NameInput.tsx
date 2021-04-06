import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSummoner,
    getNameInput,
    setName,
} from "../state/namesSlice";
import {IconButton, InputAdornment, makeStyles, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    input: {
        marginTop: theme.spacing(2),
        backgroundColor: 'white',
        fontFamily: 'Ubuntu Mono'
    }
}))

const NameInput = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const summonerName = useSelector(getNameInput);

    const keypress = (e: any) => {
        if (e.keyCode === 13) {
            dispatch(fetchSummoner())
        }
    }

    const click = (e: any) => {
        dispatch(fetchSummoner())
    }

    return (
            <TextField
                id='summoner-name'
                variant='outlined'
                size='small'
                fullWidth
                className={classes.input}
                placeholder='Summoner name'
                value={summonerName}
                onKeyDown={keypress}
                inputProps={{
                    style: {fontFamily: 'Ubuntu Mono'}
                }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position='end'>
                            <IconButton size='small' onClick={click}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>

                }}
                onChange={(e) => dispatch(setName(e.target.value))}
            />
    )
};

export default NameInput;