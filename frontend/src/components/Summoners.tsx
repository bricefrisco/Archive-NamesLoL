import React from 'react'
import {Divider, makeStyles, Typography} from "@material-ui/core";
import SummonersTable from "./SummonersTable";
import Filters from "./Filters";
import Pagination from "./Pagination";

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontFamily: "Ubuntu Mono",
        fontSize: 48,
        fontWeight: 400,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
        '@media (max-width: 600px)': {
            fontSize: 32
        }
    },
    box: {
        display: 'flex',
        marginTop: theme.spacing(2),
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        '@media (max-width: 850px)': {
            flexWrap: 'wrap',
            flexDirection: 'column-reverse'
        }
    },
    tableArea: {
        width: '100%'
    },
}))

const Summoners = () => {
    const classes = useStyles()

    return (
        <>
            <Typography variant='h1' className={classes.title}>League of Legends Names</Typography>
            <Divider />
            <div className={classes.box}>
                <div className={classes.tableArea}>
                    <Pagination showWhenLoading={false}/>
                    <SummonersTable />
                    <Pagination />
                </div>
                <Filters />
            </div>
        </>
    )
}

export default Summoners;