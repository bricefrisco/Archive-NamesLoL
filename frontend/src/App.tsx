import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import NamesLoL from "./components/NamesLoL";
import Navigation from "./components/Navigation";
import BetaAuth from "./components/BetaAuth";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: 'rgb(34,43,54)'
        },
        secondary: {
            main: 'rgb(23,28,36)',
        },
        text: {
            secondary: 'rgba(255, 255, 255, 0.85)'
        }
    }
})

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route exact path='/riot.txt' component={() => {
                        window.location.href = 'http://nameslol.s3-website-us-east-1.amazonaws.com/riot.txt'
                        return null;
                    }}/>
                    <Route exact path='/search'>
                        <>
                            <Navigation/>
                            <NamesLoL/>
                        </>
                    </Route>
                    <Route path='/'>
                        <BetaAuth/>
                    </Route>
                </Switch>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;
