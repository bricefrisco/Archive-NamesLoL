import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {fetchSummoners, getSummoners, getSummonersApiValues} from "../state/namesSlice";
import {makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Moment from "react-moment";

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
        maxWidth: 900,
    }
}))

const SummonersTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const summoners = useSelector(getSummoners)

    useEffect(() => {
        dispatch(fetchSummoners(new Date().valueOf(), false))
    }, [])

    if (!summoners) return null;
    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Availability Date</TableCell>
                        <TableCell>Last Activity</TableCell>
                        <TableCell>Level</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summoners.map((summoner: Summoner) => (
                        <TableRow key={summoner.accountId}>
                            <TableCell>{summoner.name}</TableCell>
                            <TableCell>
                                <Moment date={new Date(summoner.availabilityDate)} format='MM/DD/YYYY hh:mm A'/>
                            </TableCell>
                            <TableCell>
                                <Moment date={new Date(summoner.revisionDate)} format='MM/DD/YYYY hh:mm A'/>
                            </TableCell>
                            <TableCell>{summoner.level}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SummonersTable;