import React from 'react'
import {Divider, makeStyles, Typography} from "@material-ui/core";
import SummonersTable from "./SummonersTable";
import Filters from "./Filters";
import Pagination from "./Pagination";

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 500,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    box: {
        display: 'flex',
        marginTop: theme.spacing(2),
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    tableArea: {
        width: '100%'
    }
}))

const Summoners = () => {
    const classes = useStyles()

    return (
        <>
            <Typography variant='h2' className={classes.title}>League of Legends Names</Typography>
            <Divider />
            <div className={classes.box}>
                <div className={classes.tableArea}>
                    <Pagination showWhenLoading={true}/>
                    <SummonersTable />
                    <Pagination />
                </div>
                <Filters />
            </div>
        </>
    )
}

export default Summoners;