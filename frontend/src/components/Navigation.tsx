import {AppBar, Container, FormControl, makeStyles, MenuItem, Select, Toolbar, Typography} from "@material-ui/core";
import React from "react";
import {changeRegion, getRegion, Region} from "../state/settingsSlice";
import {useDispatch, useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    flexGrow: 1,
  },
  selectForm: {
    // minWidth: 90,
  },
  select: {
    height: 40,
    color: '#fff',
    fontWeight: 500,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
      '& > svg': {
        color: '#fff'
      },
    "& > .MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiSelect-filled": {
      paddingTop: 10,
      paddingBottom: 10,
      "&:focus,&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
    },
  }
}));

const Navigation = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const region = useSelector(getRegion)

  return (
    <AppBar position="static">
      <Toolbar>
        <Container className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          NamesLoL
        </Typography>
        <FormControl className={classes.selectForm}>
          <Select
              autoWidth
              value={region}
              variant="filled"
              disableUnderline
              className={classes.select}
              onChange={(e) => dispatch(changeRegion(e.target.value))}
          >
            {Object.keys(Region).map((region) => (
                <MenuItem
                    key={region.toString().toUpperCase()}
                    value={region}
                >
                  {region.toString().toUpperCase()}
                </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
