import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router";

const Home = () => {

  const [join, setJoin] = useState(false)
  const [create, setCreate] = useState(false)
  const [roomId, setRoomId] = useState("")

  const navigate = useNavigate()

  const createRoom = () => {
    console.log("creating room")
    setCreate(true)
    setJoin(false)
    setRoomId(generateRandomString(6))
  }

  const joinRoom = () => {
    console.log("joining room")
    setJoin(true)
    setCreate(false)
  }

  const enterRoom = () => {
    navigate("/" + roomId)
  }

  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
        {
          create && (
            <Box
              m={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="subtitle1">
                Room-ID: {roomId}
              </Typography>
              <Button
                variant="contained"
                color="primary" 
                sx={{ height: 40, marginLeft: "8px" }}
                onClick={enterRoom}
              >
                enter
              </Button>
            </Box>
          )
        }
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