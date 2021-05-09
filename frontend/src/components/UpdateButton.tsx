import React from "react";
import ReplayIcon from "@material-ui/icons/Replay";
import { CircularProgress, IconButton } from "@material-ui/core";
import { parseResponse } from "../utils/api";
import { getBetaKey, getLimit, getRegion, toggleLimit } from "../state/settingsSlice";
import { updateSummoner } from "../state/summonersSlice";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";

interface Props {
  summonerName: string;
}

const UpdateButton = ({ summonerName }: Props) => {
  const dispatch = useDispatch();
  const limit = useSelector(getLimit);
  const region = useSelector(getRegion);
  const betaKey = useSelector(getBetaKey);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<undefined | string>();

  const click = () => {
    if (loading || limit) return;

    dispatch(toggleLimit())

    setError(undefined);
    setLoading(true);
    setSuccess(false);

    fetch(`${process.env.REACT_APP_BACKEND_URI}/riot/${region}/summoners/${summonerName}`, {headers: {Authorization: betaKey}})
      .then(parseResponse)
      .then((summoner: any) => {
        dispatch(updateSummoner(summoner));
        setSuccess(true);
        setLoading(false);
        setError(undefined);
      })
      .catch((err) => {
        setLoading(false)
        setError(err)
      });
  };

  if (loading) return <CircularProgress size={24} />;
  if (success) return <CheckIcon />;
  if (error) return <ErrorIcon />;

  return (
    <IconButton size="small" onClick={click} disabled={limit}>
      <ReplayIcon />
    </IconButton>
  );
};

export default UpdateButton;
