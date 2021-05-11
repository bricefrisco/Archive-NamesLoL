import React, {useEffect} from 'react';
import {Container, IconButton, InputAdornment, makeStyles, TextField, Typography, Zoom} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {authenticateBeta, getError, getErrorMessage, getLoaded} from "../state/settingsSlice";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
        marginBottom: theme.spacing(5),
        color: '#fff'
    },
    desc: {
        lineSpacing: 1.7,
        lineHeight: 1.7,
        letterSpacing: 1.1,
        textAlign: 'center',
        marginBottom: theme.spacing(5),
        color: theme.palette.text.secondary,
        maxWidth: 800
    },
    input: {
        minWidth: '80%',
        '& input': {
            color: theme.palette.text.secondary
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgb(46, 96, 156)',
            },
        },
        '& .MuiInputLabel-outlined': {
            color: 'rgba(255, 255, 255, 0.6)'
        }
    },
    check: {
        fontSize: 150,
        color: '#3CB280'
    },
    visibility: {
        color: theme.palette.text.secondary
    }
}))

const BetaAuth = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const [key, setKey] = React.useState('');
    const [showKey, setShowKey] = React.useState(false);

    const error = useSelector(getError);
    const errorMessage = useSelector(getErrorMessage);
    const loaded = useSelector(getLoaded);

    useEffect(() => {
        if (loaded) {
            setTimeout(() => history.push('/search'), 1200);
        }
    }, [loaded])

    const onKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            dispatch(authenticateBeta(key));
        }
    }

    if (loaded) {
        return (
            <Container className={classes.container}>
                <Zoom in={true} timeout={600}>
                    <VerifiedUserIcon className={classes.check}/>
                </Zoom>
            </Container>
        )
    }

    return (
        <Container className={classes.container}>
            <Typography className={classes.title} variant='h2' component='h1'>NamesLoL</Typography>
            <Typography className={classes.desc}>
                NamesLoL is currently under development and is available for beta-use only. Please enter your beta key
                below.{' '}
                <strong>Riot employees</strong>: The beta key is included in the production application.
            </Typography>
            <TextField
                error={error}
                helperText={errorMessage}
                type={showKey ? 'text' : 'password'}
                label="Beta Key"
                className={classes.input}
                variant='outlined'
                value={key}
                onKeyPress={onKeyPress}
                onChange={(e) => setKey(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                className={classes.visibility}
                                aria-label='Toggle password visibility'
                                onClick={() => setShowKey(!showKey)}
                            >
                                {showKey ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </Container>
    )
}

export default BetaAuth;