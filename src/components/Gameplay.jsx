import { Alert, Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import React, { useState, useEffect } from "react"
import { useSocketContext } from "../hooks/useSocketContext";
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import Timer from "./Timer";

const Gameplay = ({ isTurn, room, turn }) => {
  const socket = useSocketContext();

  const [randomAlpha, setRandomAlpha] = useState("")
  const [alphabet, setAlphabet] = useState("");
  const [user, setUser] = useState("");

  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [animal, setAnimal] = useState("");
  const [thing, setThing] = useState("");

  const [seconds, setSeconds] = useState(120);
  const [submitted, setSubmitted] = useState(false);

  function generateRandomAlphabet() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    setRandomAlpha(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  let intervalId;

  useEffect(() => {
    if (isGenerating) {
      intervalId = setInterval(generateRandomAlphabet, 50);
    }

    return () => {
      clearInterval(intervalId);
    }

  }, [isGenerating]);

  useEffect(() => {
    socket.on("receive_alphabet", (data) => {
      console.log(data.alphabet, data.name);
      setAlphabet(data.alphabet);
      setSeconds(120);
      setUser(data.name);
    });

    socket.on("change_turn", () => {
      setUser('');
      setRandomAlpha('');
      setAlphabet('');
      setIsGenerating(false);
      setGenerated(false);
      setSeconds(-1);
      setSubmitted(false);
    });

    socket.on("first_submit", () => {
      if (seconds > 30) {
        console.log("setting seconds 30");
        setSeconds(30);
      }
    });

    return () => {
      socket.off("receive_alphabet");
      socket.off("change_turn");
      socket.off("first_submit");
      socket.off("final_submit");
    };
  }, [socket]);

  const alphabetGenerated = () => {
    setIsGenerating(!isGenerating);
    if (isGenerating) {
      socket.emit("send_alphabet", {
        room: room,
        alphabet: randomAlpha.toLowerCase()
      });
      setAlphabet(randomAlpha);
      setIsGenerating(false);
      setGenerated(true);
      setRandomAlpha('');
      setSeconds(120);
    }
  };

  const submitHandler = (e) => {
    e?.preventDefault();

    const submission = {
      name: name.toLowerCase(),
      place: place.toLowerCase(),
      animal: animal.toLowerCase(),
      thing: thing.toLowerCase()
    }

    console.log("submitting");
    socket.emit("submit", {
      room,
      submission
    });

    setName('');
    setPlace('');
    setAnimal('');
    setThing('');

    setSeconds(-1);
    setSubmitted(true);
  };

  return (
    <>
      <Box
        m={1}
        display="flex"
        sx={{ marginTop: "2em" }}
        flexDirection="column"
      >
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          {isTurn ?
            generated ?
              <Alert severity="info">
                {`You generated ${alphabet}`}
              </Alert>
              :
              <>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ height: 40, minWidth: 100, marginRight: "1em" }}
                  onClick={alphabetGenerated}
                >
                  {isGenerating ? "stop" : "start"}
                </Button>
                {randomAlpha && <Typography variant="h5" style={{ marginTop: "10px", width: "1em" }} >{randomAlpha}</Typography>}
              </>
            :
            <Alert
              severity="info"
            >
              {alphabet ? `${user} generated ${alphabet}` : `${turn} is generating`}
            </Alert>
          }
        </Box>
        {alphabet && !submitted &&
          <>
            <Box
              display="flex"
              m={1}
            >
              <Alert
                icon={<CrisisAlertIcon />}
                severity="success"
                sx={{ marginRight: "auto" }}
              >
                {alphabet}
              </Alert>
              <Timer seconds={seconds} setSeconds={setSeconds} onTimerEnd={submitHandler} />
            </Box>
            {!submitted &&
              <form
                style={{ display: "flex", flexDirection: "column", marginTop: "2em", justifyContent: "center" }}
                onSubmit={submitHandler}
              >
                <FormControl style={{ marginBottom: "1em" }} required="true">
                  <InputLabel htmlFor="name-input">Name</InputLabel>
                  <Input required="true" id="name-input" onChange={(e) => setName(e.target.value)} value={name} disabled={alphabet === ''} />
                </FormControl>
                <FormControl style={{ marginBottom: "1em" }} required="true">
                  <InputLabel htmlFor="place-input">Place</InputLabel>
                  <Input required="true" id="place-input" onChange={(e) => setPlace(e.target.value)} value={place} disabled={alphabet === ''} />
                </FormControl>
                <FormControl style={{ marginBottom: "1em" }} required="true">
                  <InputLabel htmlFor="animal-input">Animal</InputLabel>
                  <Input required="true" id="animal-input" onChange={(e) => setAnimal(e.target.value)} value={animal} disabled={alphabet === ''} />
                </FormControl>
                <FormControl style={{ marginBottom: "2em" }} required="true">
                  <InputLabel htmlFor="thing-input">Thing</InputLabel>
                  <Input required="true" id="thing-input" onChange={(e) => setThing(e.target.value)} value={thing} disabled={alphabet === ''} />
                </FormControl>
                {!(name === '' || place === '' || animal === '' || thing === '') &&
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: 40, width: 100, margin: "auto" }}
                    disabled={alphabet === ''}
                    onClick={submitHandler}
                  >
                    Submit
                  </Button>
                }
              </form>
            }
          </>
        }
        {submitted && <Alert sx={{position: "absolute", bottom: "1em"}}>Submitted</Alert>}
      </Box>
    </>
  )
};

export default Gameplay;