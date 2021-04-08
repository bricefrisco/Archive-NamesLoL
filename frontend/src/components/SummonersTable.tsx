import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSummoners, getNameLength,
    getSummoners,
    getSummonersHaveLoaded,
    getSummonersLoading
} from "../state/namesSlice";
import {
    LinearProgress,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import Moment from "react-moment";
import moment from "moment";
import UpdateButton from "./UpdateButton";

interface Summoner {
    region: string,
    accountId: string,
    revisionDate: number,
    level: number,
    availabilityDate: number,
    name: string,
    lastUpdated: number
}

const useStyles = makeStyles((theme) => ({
    table: {
        width: '100%',
        maxWidth: 900,
        marginBottom: theme.spacing(2)
    }
}))

const SummonersTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const loading = useSelector(getSummonersLoading)
    const loaded = useSelector(getSummonersHaveLoaded)
    const summoners = useSelector(getSummoners)
    const nameLength = useSelector(getNameLength)

    useEffect(() => {
        dispatch(fetchSummoners(new Date().valueOf(), false))
    }, [nameLength])

    if (loading) return (
        <div className={classes.table}>
            <LinearProgress />
        </div>
    )

    if (!loaded) return null;

    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align='left'>Name</TableCell>
                        <TableCell align='center'>Availability Date</TableCell>
                        <TableCell align='left'>Name Available</TableCell>
                        <TableCell align='right'>Level</TableCell>
                        <TableCell align='left'>Last Updated</TableCell>
                        <TableCell align='right'>Update</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summoners.map((summoner: Summoner) => (
                        <TableRow key={summoner.accountId}>
                            <TableCell align='left'>{summoner.name}</TableCell>
                            <TableCell align='center'>
                                <Moment date={new Date(summoner.availabilityDate)}
                                        format='MM/DD/YYYY hh:mm A'/>
                            </TableCell>
                            <TableCell align='left'>
                                {moment(summoner.availabilityDate).fromNow()}
                            </TableCell>
                            <TableCell align='right'>{summoner.level}</TableCell>
                            <TableCell align='left'>{summoner.lastUpdated ? moment(summoner.lastUpdated).fromNow() : 'Never'}</TableCell>
                            <TableCell align='right'>
                                <UpdateButton summonerName={summoner.name} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SummonersTable;