import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSummoner, getLimit,
    getNameInput, getSummonerLoading, setLimit,
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
    const loading = useSelector(getSummonerLoading);
    const limit = useSelector(getLimit);

    const click = () => {
        dispatch(setLimit(true))
        setTimeout(() => dispatch(setLimit(false)), 1300)
        dispatch(fetchSummoner())
    }

    const keypress = (e: any) => {
        if (e.keyCode === 13) {
            click()
        }
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
                disabled={loading || limit}
            />
    )
};

export default NameInput;