import React from "react";
import ReplayIcon from "@material-ui/icons/Replay";
import { CircularProgress, IconButton } from "@material-ui/core";
import { parseResponse } from "../utils/api";
import { getLimit, getRegion, setLimit } from "../state/settingsSlice";
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

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<undefined | string>();

  const click = () => {
    dispatch(setLimit(true));
    setTimeout(() => dispatch(setLimit(false)), 1300);

    setError(undefined);
    setLoading(true);
    setSuccess(false);

    fetch(`http://localhost:8080/${region}/summoners/${summonerName}`)
      .then(parseResponse)
      .then((summoner) => {
        dispatch(updateSummoner(summoner));
        setSuccess(true);
        setLoading(false);
        setError(undefined);
      })
      .catch((err) => setError(err));
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
