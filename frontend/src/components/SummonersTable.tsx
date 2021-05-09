import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummoners,
  getSummoners,
  getLoaded,
  getLoading, getError, getErrorMessage,
} from "../state/summonersSlice";
import { getNameLength, getRegion } from "../state/settingsSlice";
import {
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Moment from "react-moment";
import moment from "moment";
import UpdateButton from "./UpdateButton";
import {Alert} from "@material-ui/lab";

interface Summoner {
  region: string;
  accountId: string;
  revisionDate: number;
  level: number;
  availabilityDate: number;
  name: string;
  lastUpdated: number;
}

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    maxWidth: 950,
    marginBottom: theme.spacing(2),
  },
  semiGray: {
    color: 'rgba(0, 0, 0, 0.75)'
  },
  link: {
    color: '#0d6efd',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  alert: {
    margin: theme.spacing(3)
  },
  hideOnMediumScreen: {
    '@media (max-width: 1276px)': {
      display: 'none'
    }
  },
  hideOnSmallScreen: {
    '@media (max-width: 1000px)': {
      display: 'none'
    }
  }
}));

const SummonersTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(getLoading);
  const loaded = useSelector(getLoaded);
  const error = useSelector(getError);
  const errorMessage = useSelector(getErrorMessage);
  const summoners = useSelector(getSummoners);
  const nameLength = useSelector(getNameLength);
  const region = useSelector(getRegion);

  useEffect(() => {
    dispatch(fetchSummoners(new Date().valueOf(), false));
  }, [nameLength, region, dispatch]);

  if (loading)
    return (
      <div className={classes.table}>
        <LinearProgress />
      </div>
    );

  if (error) {
    return (
        <Alert severity='error' className={classes.alert}>
          Oh no! An error occurred: '{errorMessage}'<br />
          Please <span className={classes.link} onClick={() => dispatch(fetchSummoners(new Date().valueOf(), false))}>try again.</span>{' '}
          If the issue persists, please let us know{' '}
          <a className={classes.link} target='_blank' rel='noreferrer noopener' href='https://github.com/bricefrisco/LoLNames/issues/new'>here.</a>
        </Alert>
    )
  }

  if (!loaded) return null;


  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Name Available</TableCell>
            <TableCell align="center" className={classes.hideOnSmallScreen}>Availability Date</TableCell>
            <TableCell align="right" className={classes.hideOnMediumScreen}>Level</TableCell>
            <TableCell align="left">Last Updated</TableCell>
            <TableCell align="right">Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summoners.map((summoner: Summoner, idx: number) => (
            <TableRow key={idx}>
              <TableCell align="left">{summoner.name}</TableCell>
              <TableCell align="left">
                {moment(summoner.availabilityDate).fromNow()}
              </TableCell>
              <TableCell align="center" className={`${classes.semiGray} ${classes.hideOnSmallScreen}`}>
                <Moment
                  date={new Date(summoner.availabilityDate)}
                  format="MM/DD/YYYY hh:mm A"
                />
              </TableCell>
              <TableCell align="right" className={`${classes.semiGray} ${classes.hideOnMediumScreen}`}>{summoner.level}</TableCell>
              <TableCell align="left">
                {summoner.lastUpdated
                  ? moment(summoner.lastUpdated).fromNow()
                  : "Never"}
              </TableCell>
              <TableCell align="right">
                <UpdateButton summonerName={summoner.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SummonersTable;
