import React from 'react'
import {IconButton, LinearProgress, makeStyles, Typography} from "@material-ui/core";
import Moment from "react-moment";
import {getSummoner, getSummonerLoading} from "../state/namesSlice";
import {useSelector} from "react-redux";
import {Close} from "@material-ui/icons";
import {Alert} from "@material-ui/lab";

interface Summoner {
    id: string,
    accountId: string,
    puuid: string,
    name: string,
    profileIconId: number,
    revisionDate: number,
    summonerLevel: number,
    region: string,
    level: number,
    availabilityDate: number,
    lastUpdated: number
}

interface Props {
    summoner: Summoner
}

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(2),
        borderRadius: 5,
        minHeight: 100,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    available: {
        backgroundColor: 'rgb(36,162,138)',
        color: '#fff'
    },
    unavailable: {
        backgroundColor: 'rgb(247,195,109)',
        color: '#000'
    },
    neverAvailable: {
        backgroundColor: 'rgb(183,107,162)'
    },
    name: {
        textAlign: 'center',
        fontWeight: 400
    },
    status: {
        textAlign: 'center'
    },
    label: {
        marginBottom: theme.spacing(0.3),
        fontWeight: 500
    },
    disclosure: {
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: 12,
        color: 'grey'
    },
    loading: {
        marginTop: theme.spacing(2)
    }
}))

const Summoner = ({summoner}: Props) => {
    const classes = useStyles();
    const loading = useSelector(getSummonerLoading);

    if (loading) {
        return <LinearProgress className={classes.loading}/>
    }

    if (!summoner) return null;

    const infoAvailable = summoner.availabilityDate !== undefined;
    const nameAvailable = !infoAvailable || (new Date(summoner.availabilityDate) <= new Date());

    const getClassName = () => {
        if (nameAvailable) {
            return `${classes.card} ${classes.available}`
        } else {
            return `${classes.card} ${classes.unavailable}`
        }
    }

    return (
        <>
            <div className={getClassName()}>
                <Typography variant='h3' className={classes.name}>{summoner.name}</Typography>
                <div className={classes.status}>
                    <div className={classes.label}>Status</div>
                    <div>{nameAvailable ? 'Available*' : 'Unavailable'}</div>
                </div>
                {infoAvailable && (
                    <>
                        <div className={classes.status}>
                            <div className={classes.label}>Availability Date</div>
                            <Moment date={new Date(summoner.availabilityDate)} format='MM/DD/YYYY hh:mm A'/>
                        </div>
                        <div className={classes.status}>
                            <div className={classes.label}>Last Activity</div>
                            <Moment date={new Date(summoner.revisionDate)} format='MM/DD/YYYY'/>
                        </div>
                        <div className={classes.status}>
                            <div className={classes.label}>Level</div>
                            <div>{summoner.level}</div>
                        </div>
                    </>
                )}
            </div>
            {nameAvailable && (
                <Typography className={classes.disclosure}>
                    *If the name is not blocked by Riot Games
                </Typography>
            )}
        </>
    )
}

export default Summoner;