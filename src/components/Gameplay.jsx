import { Alert, Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import React, { useState, useEffect } from "react"
import { useSocketContext } from "../hooks/useSocketContext";
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import Timer from "./Timer";

const Gameplay = ({ isTurn, room }) => {
  const socket = useSocketContext();

  const [randomAlpha, setRandomAlpha] = useState("")
  const [alphabet, setAlphabet] = useState("");
  const [user, setUser] = useState("");

  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [animal, setAnimal] = useState("");
  const [thing, setThing] = useState("");

  const [seconds, setSeconds] = useState(120);

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

    socket.on("receive_message", (data) => {
      console.log(data.message, data.name);
      setAlphabet(data.message);
      setSeconds(120);
      setUser(data.name);
    });

    socket.on("change_turn", ()=> {
      setUser('');
      setRandomAlpha('');
      setAlphabet('');
      setIsGenerating(false);
      setGenerated(false);
      setSeconds(0);
    });

    return () => {
      clearInterval(intervalId);
      socket.off("receive_message");
      socket.off("change_turn");
    };
  }, [isGenerating]);

  const alphabetGenerated = () => {
    setIsGenerating(!isGenerating);
    if (isGenerating) {
      socket.emit("send_message", {
          room: room,
          message: randomAlpha
      });
      setAlphabet(randomAlpha);
      setIsGenerating(false);
      setGenerated(true);
      setRandomAlpha('');
      setSeconds(120);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("changing turn");
    socket.emit("change_turn", {room});
    setUser('');
    setRandomAlpha('');
    setAlphabet('');
    setIsGenerating(false);
    setGenerated(false);
    setSeconds(0);
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
              {`Generated ${alphabet}`}
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
              {randomAlpha && <Typography variant="h5" style={{ marginTop: "10px" }} >{randomAlpha}</Typography>}
            </>
          :
          <Alert 
            severity="info"
          >
            {alphabet ? `${user} generated ${alphabet}`: "This is not your turn"}
          </Alert>
        }
        </Box>
        {alphabet &&
          <Box
            display="flex"
            m={1}
          >
            <Alert 
              icon={<CrisisAlertIcon />}
              severity="success"
              sx={{marginRight: "auto"}}
            >
              {alphabet}
            </Alert>
            <Timer seconds={seconds} setSeconds={setSeconds} />
          </Box>
        }
      </Box>

      <form
        style={{ display: "flex", flexDirection: "column", marginTop: "2em", justifyContent: "center" }}
        onSubmit={submitHandler}
      >
        <FormControl style={{ marginBottom: "1em" }}>
          <InputLabel htmlFor="name-input">Name</InputLabel>
          <Input id="name-input" onChange={(e)=>setName(e.target.value)}/>
        </FormControl>
        <FormControl style={{ marginBottom: "1em" }}>
          <InputLabel htmlFor="place-input">Place</InputLabel>
          <Input id="place-input" onChange={(e)=>setPlace(e.target.value)}/>
        </FormControl>
        <FormControl style={{ marginBottom: "1em" }}>
          <InputLabel htmlFor="animal-input">Animal</InputLabel>
          <Input id="animal-input" onChange={(e)=>setAnimal(e.target.value)}/>
        </FormControl>
        <FormControl style={{ marginBottom: "2em" }}>
          <InputLabel htmlFor="thing-input">Thing</InputLabel>
          <Input id="thing-input" onChange={(e)=>setThing(e.target.value)}/>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ height: 40, width: 100, margin: "auto" }}
          onClick={submitHandler}
        >
          Submit
        </Button>
      </form>
    </>
  )
};

export default Gameplay;