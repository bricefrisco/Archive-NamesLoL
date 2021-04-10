import React from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setNameLength } from "../state/namesSlice";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "inline-block",
    minWidth: 300,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: theme.spacing(2),
    marginTop: theme.spacing(6),
  },
  title: {
    fontWeight: 500,
    fontSize: "0.9rem",
    paddingBottom: theme.spacing(0.3),
  },
  control: {
    marginTop: theme.spacing(2),
    minWidth: "100%",
  },
  button: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

const menuItems = ["Any", 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const Filters = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [nl, setNL] = React.useState<any>("Any");

  const apply = () => {
    dispatch(setNameLength(nl));
  };

  return (
    <div className={classes.card}>
      <Typography className={classes.title}>Filters</Typography>
      <Divider />
      <FormControl className={classes.control}>
        <InputLabel id="filter-name-length-input">Name Length</InputLabel>
        <Select
          displayEmpty
          labelId="filter-name-length-input"
          value={nl}
          onChange={(e) => setNL(e.target.value)}
        >
          {menuItems.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={apply}
      >
        Apply
      </Button>
    </div>
  );
};

export default Filters;
