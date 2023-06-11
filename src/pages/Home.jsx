import {
  Box,
  Button,
  TextField
} from "@mui/material"
import React, {useState} from "react"

const Home = () => {

  const [join, setJoin] = useState(false)
  const [create, setCreate] = useState(false)

  const createRoom = () => {
    console.log("creating room")
    setCreate(!create)
  }

  const joinRoom = () => {
    console.log("joining room")
    setJoin(!join)
  }

  return (
    <>
      <Box
        m={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button 
          variant="contained"
          color="primary"
          sx={{ height: 40, width: 150 }}
          onClick={createRoom}
        >
          Create Room
        </Button>
      </Box>
      <Box
        m={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button 
          variant="contained"
          color="primary" 
          sx={{ height: 40, width: 150 }}
          onClick={joinRoom}
        >
          Join Room
        </Button>
        {
          join && (
            <Box
              m={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                id="outlined-basic" 
                label="room-id" 
                variant="outlined"
                autocomplete="off" 
              />
              <Button
                variant="contained"
                color="primary" 
                sx={{ height: 40, marginLeft: "8px" }}
              >
                join
              </Button>
            </Box>
          )
        }
      </Box>
    </>
  )
}

export default Home;