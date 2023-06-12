import {
  Box,
  Button,
  TextField
} from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router";

const Home = () => {
  const [join, setJoin] = useState(false)
  const [roomId, setRoomId] = useState("")

  const navigate = useNavigate()

  const createRoom = () => {
    console.log("creating room")
    setJoin(false)
    navigate("/" + generateRandomString(6))
  }

  const joinRoom = () => {
    console.log("joining room")
    setJoin(true)
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
    <div className="homeBody">
      <div className="overlay">
        <Box
          m={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="secondary"
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
            color="success"
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
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ height: 40, marginLeft: "8px" }}
                  onClick={enterRoom}
                >
                  join
                </Button>
              </Box>
            )
          }
        </Box>
      </div>
    </div>
  )
}

export default Home;