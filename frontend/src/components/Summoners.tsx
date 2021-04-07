import React from 'react'
import {makeStyles} from "@material-ui/core";
import SummonersTable from "./SummonersTable";
import Filters from "./Filters";

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'flex',
        marginTop: theme.spacing(2),
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
}))

const Summoners = () => {
    const classes = useStyles()

    return (
        <div className={classes.box}>
            <SummonersTable />
            <Filters />
        </div>
    )
}

export default Summoners;