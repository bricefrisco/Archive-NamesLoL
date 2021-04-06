import React from 'react';
import {useSelector} from "react-redux";
import {
    getSummoner,
    getSummonerApiValues,
} from "../state/namesSlice";
import {Container} from "@material-ui/core";
import Summoner from "./Summoner";
import NameInput from "./NameInput";
import SummonersTable from "./SummonersTable";

const Lookup = () => {
    const summoner = useSelector(getSummoner);
    const summonerApiValues = useSelector(getSummonerApiValues)

    return (
        <Container>
            <NameInput />
            {summoner && <Summoner summoner={summoner}/>}
            {summonerApiValues.error && <div>{summonerApiValues.errorMessage}</div>}
            <SummonersTable />
        </Container>
    )
};

export default Lookup;