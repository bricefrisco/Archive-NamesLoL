import React from "react";
import { useSelector } from "react-redux";
import { getSummoner, getError, getErrorMessage } from "../state/summonerSlice";
import { Container } from "@material-ui/core";
import Summoner from "./Summoner";
import NameInput from "./NameInput";
import Summoners from "./Summoners";

const Lookup = () => {
  const summoner = useSelector(getSummoner);
  const error = useSelector(getError);
  const errorMessage = useSelector(getErrorMessage);

  return (
    <Container>
      <NameInput />
      <Summoner summoner={summoner} />
      {error && <div>{errorMessage}</div>}
      <Summoners />
    </Container>
  );
};

export default Lookup;
