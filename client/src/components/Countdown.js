import { Button, Card, CardContent, CircularProgress, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { Component } from "react";

import {
  Autorenew,
  PlayArrow,
  Pause,
  Timelapse,
  Done
} from "@mui/icons-material";
import countdown from "countdown";
// import { withStyles } from "@mui/styles";

const styles = theme => ({
  Button: {
    margin: 10,
    "@media screen and (min-width: 600px)": {
      margin: 20
    }
  },
  Paper: {
    "@media screen and (max-width: 600px)": {
      marginTop: 60
    },
    marginTop: 70,

    paddingTop: 30,
    paddingBottom: 96,
    textAlign: "center",
    minHeight: "90vh"
  },
  Typography: {
    height: 50,
    margin: 20
  },
  IconButton: {
    margin: 5
  },
  Form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingBottom: 10,
    "@media screen and (min-width: 360px)": {
      flexDirection: "row"
    }
  },
  TextField: {
    width: 200,
    margin: 25,
    "@media screen and (min-width: 600px)": {
      margin: 20
    }
  },
  Card: {
    maxWidth: 300,
    margin: "0 auto",
    "@media screen and (min-width: 600px)": {
      maxWidth: 500
    }
  }
});

export default class Countdown extends Component {
  state = {
    isRunning: false,
    currentPercentage: 100,
    timerId: 0,
    reminder: 0,
    tsMin: 0,
    tsSec: 0,
    manualTime: 0
  };

  initiateCountdown = () => {
    const addMinutes = (minutes, seconds) =>
      new Date(new Date().getTime() + minutes * 60000 + seconds * 1000);

    const { tsMin, tsSec } = this.state;
    const { currentCountdown } = this.props;

    const deadline =
      tsMin === 0 && tsSec === 0
        ? addMinutes(currentCountdown, 0)
        : addMinutes(tsMin, tsSec);

    this.setState({
      timerId: countdown(
        deadline,
        ts => {
          this.progressCountdown(ts);
          this.checkIfFinished();
        },
        countdown.HOURS | countdown.MINUTES | countdown.SECONDS
      ),
      isRunning: true
    });
  };

  progressCountdown = ts => {
    const timeLeft = ts.minutes * 60 + ts.seconds;
    const currentCountdownSeconds = this.props.currentCountdown * 60;

    this.setState(() => ({
      currentPercentage:
        ((currentCountdownSeconds - (currentCountdownSeconds - timeLeft)) /
          currentCountdownSeconds) *
        100,
      tsMin: ts.minutes,
      tsSec: ts.seconds
    }));
  };

  checkIfFinished = () => {
    const { tsMin, tsSec, isRunning } = this.state;
    const fiveMin = 50000;

    if (tsMin === 0 && tsSec === 0 && isRunning === true) {
      // const audio = new Audio(Beep);
      // audio.play();

      this.clearTimer();
      this.setState({ reminder: setInterval(() => {
        // audio.play()
      }, fiveMin) });
    }
  };

  clearTimer = cb => {
    window.clearInterval(this.state.timerId);
    this.setState(
      {
        timerId: 0,
        isRunning: false
      },
      cb
    );
  };

  clearReminder = () => {
    window.clearInterval(this.state.reminder);
    this.setState({ reminder: 0 });
  };

  handleStartPause = () => {
    const { isRunning } = this.state;

    this.clearReminder();
    this.clearTimer(() => {
      if (!isRunning) this.initiateCountdown();
    });
  };

  handleReset = () => {
    this.clearReminder();
    this.clearTimer(() => {
      this.setState(() => ({ tsMin: 0, tsSec: 0 }), this.initiateCountdown);
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentCountdown !== this.props.currentCountdown) {
      this.handleReset();
    }
  }

  render() {
    const { classes, handleChangeTimeManually } = this.props;
    const { tsMin, tsSec, reminder } = this.state;
    return (
      <Paper>
        <Card>
          <CardContent>
            <CircularProgress
              height={50}
              size={250}
              variant="determinate"
              thickness={1}
              value={this.state.currentPercentage}
            />

            <Typography
              variant="h4"
              id="countdown"
            >
              {reminder === 0
                ? `${tsMin}min - ${tsSec}s`
                : `Reminder set to 1min`}
            </Typography>
          </CardContent>
        </Card>
        <br />
        <Button
          variant="contained"
          onClick={this.handleStartPause}
        >
          <PlayArrow />
          Start / Pause
          <Pause />
        </Button>
        <Button
          variant="contained"
          onClick={this.handleReset}
        >
          <Autorenew />
          Reset
        </Button>
        <form
          noValidate="noValidate"
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            handleChangeTimeManually(this.state.manualTime);
            this.setState({ manualTime: 0 });
            const inputField = document.querySelector("#time");
            inputField.value = "";
          }}
        >
          <TextField
            id="time"
            label="How many minutes?"
            helperText="values between 0 and 60 accepted"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Timelapse />
                </InputAdornment>
              )
            }}
            onChange={event => {
              const value = Number(event.target.value);
              if (isNaN(value) || value >= 60) {
                return;
              } else {
                this.setState({ manualTime: value });
              }
            }}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
          >
            <Done />
          </Button>
        </form>
      </Paper>
    );
  }
}