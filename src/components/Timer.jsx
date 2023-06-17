import React, { useEffect } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Alert } from "@mui/material";

const Timer = ({ seconds, setSeconds, onTimerEnd}) => {
  useEffect(() => {
    if (seconds === 0) {
      onTimerEnd();
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [seconds]);

  return seconds > 0 && (
    <Alert
      icon={<AccessTimeIcon fontSize="inherit" />}
      severity="warning"
      sx={{
        color: seconds <= 30 ? "red" : "black",
        marginLeft: "auto"
      }}
    >
      {seconds}s
    </Alert>
  )
};

export default Timer;