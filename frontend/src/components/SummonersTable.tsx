import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {fetchSummoners, getSummoners, getSummonersApiValues, getSummonersLoading} from "../state/namesSlice";
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
import Pagination from "./Pagination";
import moment from "moment";

interface Summoner {
    region: string,
    accountId: string,
    revisionDate: number,
    level: number,
    availabilityDate: number,
    name: string
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
    const summoners = useSelector(getSummoners)

    useEffect(() => {
        dispatch(fetchSummoners(new Date().valueOf(), false))
    }, [])

    if (loading) return (
        <div className={classes.table}>
            <LinearProgress />
        </div>
    )

    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align='left'>Name</TableCell>
                        <TableCell align='center'>Availability Date</TableCell>
                        <TableCell align='left'>Name Available</TableCell>
                        <TableCell align='right'>Level</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summoners.map((summoner: Summoner) => (
                        <TableRow key={summoner.accountId}>
                            <TableCell align='left'>{summoner.name}</TableCell>
                            <TableCell align='center'>
                                <Moment date={new Date(summoner.availabilityDate)}
                                        format='MM/DD/YYYY hh:mm A'/>
                                {/*{` (${moment(summoner.availabilityDate).fromNow()})`}*/}
                            </TableCell>
                            <TableCell align='left'>
                                {/*<Moment date={new Date(summoner.revisionDate)} format='MM/DD/YYYY' />*/}
                                {moment(summoner.availabilityDate).fromNow()}
                            </TableCell>
                            <TableCell align='right'>{summoner.level}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SummonersTable;