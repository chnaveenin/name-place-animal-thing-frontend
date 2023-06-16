import { Alert, Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import React, { useState, useEffect } from "react"
import { useSocketContext } from "../hooks/useSocketContext";

const Gameplay = ({ isTurn, room }) => {
  const socket = useSocketContext();

  const [randomAlpha, setRandomAlpha] = useState("")
  const [alphabet, setAlphabet] = useState("");
  const [user, setUser] = useState("");

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
      setUser(data.name);
    });

    return () => {
      clearInterval(intervalId);
      socket.off("receive_message");
    };
  }, [isGenerating]);

  const alphabetGenerated = () => {
    setIsGenerating(!isGenerating);
    if (isGenerating) {
      socket.emit("send_message", {
          room: room,
          socketID: socket.id,
          message: randomAlpha
      });
      setAlphabet(randomAlpha);
      setGenerated(true);
      setUser('');
      setRandomAlpha('');
    }
  };

  return (
    <>
      <Box
        m={0}
        display="flex"
        alignItems="center"
        sx={{ marginTop: "2em" }}
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
          <Alert severity="info">
            {alphabet ? `${user} generated ${alphabet}`: "This is not your turn"}
          </Alert>
        }
      </Box>

      <form
        style={{ display: "flex", flexDirection: "column", marginTop: "2em", justifyContent: "center" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <FormControl style={{ marginBottom: "1em" }}>
          <InputLabel htmlFor="name-input">Name</InputLabel>
          <Input id="name-input" />
        </FormControl>
        <FormControl style={{ marginBottom: "1em" }}>
          <InputLabel htmlFor="place-input">Place</InputLabel>
          <Input id="place-input" a />
        </FormControl>
        <FormControl style={{ marginBottom: "1em" }}>
          <InputLabel htmlFor="animal-input">Animal</InputLabel>
          <Input id="animal-input" ar />
        </FormControl>
        <FormControl style={{ marginBottom: "2em" }}>
          <InputLabel htmlFor="thing-input">Thing</InputLabel>
          <Input id="thing-input" a />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ height: 40, width: 100, margin: "auto" }}
        >
          Submit
        </Button>
      </form>
    </>
  )
};

export default Gameplay;