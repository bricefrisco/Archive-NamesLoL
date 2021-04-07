import React from 'react'
import {IconButton, makeStyles} from "@material-ui/core";
import Moment from "react-moment";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme) => ({
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    time: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        backgroundColor: 'rgba(52,108,176,.08)',
        color: '#2e609c',
        fontWeight: 500,
        fontSize: 14,
        borderRadius: 25
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    }
}))

const Pagination = () => {
    const classes = useStyles();
    return (
        <div className={classes.pagination}>
            <IconButton size='small' className={classes.button}>
                <KeyboardArrowLeftIcon />
            </IconButton>
            <Moment date={new Date()} format='MM/DD/YYYY, hh:mm:ss A' className={classes.time}/>
            <IconButton size='small' className={classes.button}>
                <KeyboardArrowRightIcon />
            </IconButton>
        </div>
    )
}

export default Pagination;