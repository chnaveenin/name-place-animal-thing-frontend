import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import React, { useState, useEffect } from "react"

const Gameplay = () => {
  const [randomAlpha, setRandomAlpha] = useState("")

  function generateRandomAlphabet() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    setRandomAlpha(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  const [isGenerating, setIsGenerating] = useState(false);
  let intervalId;

  useEffect(() => {
    if (isGenerating) {
      intervalId = setInterval(generateRandomAlphabet, 100);
    }

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts or isGenerating is set to false
    };
  }, [isGenerating]);

  return (
    <>
      <Box
        m={0}
        display="flex"
        alignItems="center"
        sx={{marginTop: "2em"}}
      >
        <Button
          variant="contained"
          color="warning"
          sx={{ height: 40, minWidth: 100, marginRight: "1em" }}
          onClick={() => setIsGenerating(!isGenerating)}
        >
          {isGenerating ? "stop" : "start"}
        </Button>
        {randomAlpha && <Typography variant="h5" style={{ marginTop: "10px" }} >{randomAlpha}</Typography>}
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
          sx={{ height: 40, width: 100 }}
        >
          Submit
        </Button>
      </form>
    </>
  )
};

export default Gameplay;