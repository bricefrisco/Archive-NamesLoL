import React from "react";
import {Container} from "@material-ui/core";
import Summoner from "./Summoner";
import NameInput from "./NameInput";
import Summoners from "./Summoners";
import {useSelector} from "react-redux";
import {getLoaded} from "../state/settingsSlice";
import {useHistory} from "react-router-dom";
import Footer from "./Footer";

const NamesLoL = () => {
    const betaAuthenticated = useSelector(getLoaded);
    const history = useHistory();

    if (!betaAuthenticated) {
        history.push('/')
    }

    return (
        <>
            <Container color='secondary'>
                <NameInput/>
                <Summoner/>
                <Summoners/>
            </Container>
            <Footer/>
        </>
    );
};

export default NamesLoL;
