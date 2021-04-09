import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSummoner, getLimit,
    getNameInput, getRegion, getSummonerLoading, Region, setLimit,
    setName, setRegion,
} from "../state/namesSlice";
import {FormControl, IconButton, InputAdornment, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    input: {
        marginTop: theme.spacing(2),
        backgroundColor: 'white',
        fontFamily: 'Ubuntu Mono'
    },
    selectForm: {
        minWidth: 90,
    },
    select: {
        height: 40,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        '& > .MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiSelect-filled': {
            paddingTop: 10,
            paddingBottom: 10,
            '&:focus,&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0)'
            },
        },
        backgroundColor: '#fff',
        // paddingBottom: theme.spacing(1.3),
        fontSize: 14,
        fontWeight: 500
    }
}))

const NameInput = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const summonerName = useSelector(getNameInput);
    const loading = useSelector(getSummonerLoading);
    const limit = useSelector(getLimit);
    const region = useSelector(getRegion);

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
                    <>
                        <FormControl className={classes.selectForm}>
                            <Select autoWidth value={region} variant='filled' disableUnderline className={classes.select}
                                    onChange={(e) => dispatch(setRegion(e.target.value))}>
                                <MenuItem key='NA' value={Region.NA}>NA</MenuItem>
                                <MenuItem key='EUW' value={Region.EUW}>EUW</MenuItem>
                                <MenuItem key='EUW' value={Region.KR}>KR</MenuItem>
                                <MenuItem key='EUW' value={Region.EUNE}>EUNE</MenuItem>
                                <MenuItem key='EUW' value={Region.BR}>BR</MenuItem>
                                <MenuItem key='EUW' value={Region.TR}>TR</MenuItem>
                                <MenuItem key='EUW' value={Region.LAN}>LAN</MenuItem>
                                <MenuItem key='EUW' value={Region.LAS}>LAS</MenuItem>
                            </Select>
                        </FormControl>
                        <InputAdornment position='end'>
                            <IconButton size='small' onClick={click}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    </>

            }}
            onChange={(e) => dispatch(setName(e.target.value))}
            disabled={loading || limit}
        />
    )
};

export default NameInput;