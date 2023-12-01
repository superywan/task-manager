import {
  Card,
  Box,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  TextField,
  Stack,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = () => {
  const [initialDuration, setInitialDuration] = useState(600 * 3)
  const [duration, setDuration] = useState(600 * 3);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    let timerId;
    if (!paused) {
      timerId = setInterval(() => {
        setDuration((prev) => prev - 1);
      }, 1000);
      console.log(timerId);
    }

    return function cleanup() {
      clearInterval(timerId);
    };
  }, [paused]);

  const handleClick = (e) => {
    !paused ? setPaused(true) : setPaused(false);
  };

  const handleClickReset = (e) => {
    setPaused(true);
    setDuration(600 * 3);
  }

  return (
      <Container>
        <Container>
          {duration >= 0 ? (
            <CircularProgressbar value={100} text={`${('0' + Math.floor(duration / 60)).slice(-2)}:${('0' + Math.floor(duration % 60)).slice(-2)}`} styles={{width: "60%"}}/>
          ) : () => {
            setPaused(true);
            setDuration(0);
          }}
        </Container>

        <Box display="flex" justifyContent="center" mt="2rem">
          <Stack direction="row" spacing={2}>
            {paused && (
              <TextField 
                label="Time in Seconds"
                variant="filled" 
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              />
            )}
            <Button onClick={handleClick}>
              Start/Stop
            </Button>
            {paused && (
              <Button onClick={handleClickReset}>
                Reset
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
  );
};
export default Timer;
