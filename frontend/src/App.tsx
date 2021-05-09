import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import NamesLoL from "./components/NamesLoL";
import Navigation from "./components/Navigation";
import BetaAuth from "./components/BetaAuth";

function App() {
  return (
    <Router>
        <Switch>
            <Route exact path='/search'>
                <>
                    <Navigation />
                    <NamesLoL />
                </>
            </Route>
            <Route path='/'>
                <BetaAuth />
            </Route>
        </Switch>
    </Router>
  );
}

export default App;
