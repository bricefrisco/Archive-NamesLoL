import React from "react";
import { useSelector } from "react-redux";
import { getSummoner, getSummonerApiValues } from "../state/namesSlice";
import { Container } from "@material-ui/core";
import Summoner from "./Summoner";
import NameInput from "./NameInput";
import Summoners from "./Summoners";

const Lookup = () => {
  const summoner = useSelector(getSummoner);
  const summonerApiValues = useSelector(getSummonerApiValues);

  return (
    <Container>
      <NameInput />
      <Summoner summoner={summoner} />
      {summonerApiValues.error && <div>{summonerApiValues.errorMessage}</div>}
      <Summoners />
    </Container>
  );
};

export default Lookup;
