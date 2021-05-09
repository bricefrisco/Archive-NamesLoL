import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummoner, getLoading } from "../state/summonerSlice";
import {
  getLimit,
  getNameInput,
  getHideSearch,
  setHideSearch,
  setLimit,
  setName, toggleLimit,
} from "../state/settingsSlice";
import {
  IconButton,
  InputAdornment,
  makeStyles,
  TextField, Tooltip,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(2),
    backgroundColor: "white",
    fontFamily: "Ubuntu Mono",
  }
}));

const NameInput = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const summonerName = useSelector(getNameInput);
  const loading = useSelector(getLoading);
  const limit = useSelector(getLimit);
  const hideSearch = useSelector(getHideSearch);

  const click = () => {
    dispatch(toggleLimit())
    dispatch(fetchSummoner());
  };

  const keypress = (e: any) => {
    if (e.keyCode === 13) {
      click();
    }
  };

  return (
    <TextField
      id="summoner-name"
      variant="outlined"
      size="small"
      fullWidth
      className={classes.input}
      placeholder="Summoner name"
      value={summonerName}
      onKeyDown={keypress}
      inputProps={{
        style: { fontFamily: "Ubuntu Mono" },
      }}
      InputProps={{
        endAdornment: (
          <>
            <Tooltip title="Hide search (won't add summoner name to table)">
              <Checkbox size='small' color='default' checked={hideSearch} onChange={(e) => dispatch(setHideSearch(e.target.checked))}/>
            </Tooltip>
            <InputAdornment position="end">
              <IconButton size="small" onClick={click}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          </>
        ),
      }}
      onChange={(e) => dispatch(setName(e.target.value))}
      disabled={loading || limit}
    />
  );
};

export default NameInput;
