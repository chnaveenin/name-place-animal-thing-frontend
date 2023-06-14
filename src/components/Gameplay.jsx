import { Box, Button, FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
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
        m={1}
        display="flex"
        sx={{marginBottom:"2em"}}
      >
        <Button
          variant="contained"
          color="warning"
          sx={{ height: 40, minWidth: 100, marginRight: "1em" }}
          onClick={() => setIsGenerating(!isGenerating)}
        >
          {isGenerating ? "stop" : "start"}
        </Button>
        {randomAlpha && <h3 style={{marginTop: "10px"}} >{randomAlpha}</h3>}
      </Box>

      <form style={{ display: "flex" }}>
        <FormControl style={{marginRight: "2em"}}>
          <InputLabel htmlFor="name-input">Name</InputLabel>
          <Input id="name-input" />
        </FormControl>
        <FormControl style={{marginRight: "2em"}}>
          <InputLabel htmlFor="place-input">Place</InputLabel>
          <Input id="place-input" a />
        </FormControl>
        <FormControl style={{marginRight: "2em"}}>
          <InputLabel htmlFor="animal-input">Animal</InputLabel>
          <Input id="animal-input" ar />
        </FormControl>
        <FormControl style={{marginRight: "2em"}}>
          <InputLabel htmlFor="thing-input">Thing</InputLabel>
          <Input id="thing-input" a />
        </FormControl>
      </form>

    </>
  )
};

export default Gameplay;