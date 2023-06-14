import React, { useState } from "react"
import { useNavigate } from "react-router";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography
} from "@mui/material"
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';

const Home = () => {
  const [username, setUsername] = useState("")
  const [save, setSave] = useState(false)
  const [join, setJoin] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)
  const [joinloading, setJoinLoading] = useState(false)

  const navigate = useNavigate()

  const createRoom = async () => {
    setLoading(true)
    console.log("creating room")
    setJoin(false)
    while (true) {
      const temp = generateRandomString(6)
      console.log(temp)
      const response = await fetch("http://localhost:8080/room/" + temp, {
        method: "GET"
      })

      if (!response.ok) {
        setRoomId(temp)
        console.log(roomId)
        const response = await fetch("http://localhost:8080/create-room", {
          method: "POST",
          body: JSON.stringify({
            roomid: temp,
            participants: [{
              name: username,
              score: 0
            }]
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (response.ok) {
          navigate("/" + temp)
        }
        break
      }
    }
  }

  const joinRoom = () => {
    console.log("joining room")
    setJoin(!join)
  }

  const enterRoom = async () => {
    setJoinLoading(true)
    const response = await fetch("http://localhost:8080/join-room/" + roomId, {
      method: "PATCH",
      body: JSON.stringify({
        name: username,
        score: 0
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    console.log("here in func")

    if (response.ok) {
      console.log("here in res status")
      navigate("/" + roomId)
    } else {
      console.log(404)
      setJoinLoading(false)
      setError("no room found")
    }
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
    loading
      ?
      <CircularProgress />
      :
      <div className="homeBody">
        <div className="overlay">
          <Box
            m={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ marginBottom: "15%" }}
          >
            <Typography
              variant="h2"
              color="black"
              sx={{ marginBottom: "0.5em" }}
            >
              Welcome {username}
            </Typography>
            {!save &&
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSave(true)
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="username"
                  variant="filled"
                  autoComplete="off"
                  color="warning"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <IconButton
                  color="white"
                  aria-label="save username"
                  onClick={() => setSave(true)}
                  sx={{ marginTop: "10px" }}
                >
                  <DoneAllOutlinedIcon />
                </IconButton>
              </form>
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
              color="secondary"
              sx={{ height: 40, width: 150, marginRight: "1em" }}
              onClick={createRoom}
            >
              Create Room
            </Button>
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
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      enterRoom()
                    }}
                    style={{ marginRight: "0.5em" }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="roomid"
                      variant="filled"
                      autoComplete="off"
                      color="warning"
                      onChange={(e) => setRoomId(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={enterRoom}
                      sx={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      join
                    </Button>
                  </form>
                  {joinloading && <CircularProgress />}
                  {error && <Alert severity="error">{error}</Alert>}
                </Box>
              )
            }
          </Box>
        </div>
      </div>
  )
}

export default Home;