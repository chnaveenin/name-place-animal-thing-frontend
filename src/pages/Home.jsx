import React, { useState, useEffect, useRef } from "react"
import { useSocketContext } from "../hooks/useSocketContext";
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
  const socket = useSocketContext();

  const [username, setUsername] = useState("")

  const usernameRef = useRef(username);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  const [save, setSave] = useState(false)
  const [join, setJoin] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)
  const [joinloading, setJoinLoading] = useState(false)

  const [joinRoom, setJoinRoom] = useState(false);

  const navigate = useNavigate()

  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const createRoom = async () => {
    setJoin(false);
    setJoinRoom(false);
    setLoading(true);
    console.log("creating room");

    const temp = generateRandomString(6);
    console.log(temp);

    socket.emit("check_room", { room: temp });
  };

  useEffect(() => {
    socket.on("generate_new_roomid", () => {
      const newRoomId = generateRandomString(6);
      console.log(newRoomId);
      socket.emit("check_room", { room: newRoomId });
    });

    socket.on("roomid_is_valid", (data) => {
      setRoomId(data.room);
      console.log("room is valid", data.room);
      enterRoom(data.room);
    });

    socket.on("room_exists", () => {
      console.log("room exists", roomId);
      enterRoom(roomId);
    });

    socket.on("room_not_found", () => {
      setError("room not found");
    });

    return (() => {
      socket.off("roomid_is_valid");
      socket.off("generate_new_roomid");
      socket.off("room_exists");
      socket.off("room_not_found");

    })
  }, [socket]);

  const enterRoom = async (room) => {
    setJoinLoading(true);
    socket.emit("join_room", { room, username: usernameRef.current });
    console.log("join_room_info:", room, "username:", usernameRef.current);
    setJoinLoading(false);
    setLoading(false);

    console.log("navigating "+room);
    navigate("/room/" + room);
  };

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
              variant="h4"
              color="black"
              textAlign="center"
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
                  onClick={() => {
                    setSave(true)
                  }}
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
              sx={{ height: 40, width: 150, marginRight: "1em", fontWeight: "bold" }}
              onClick={createRoom}
            >
              Create Room
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ height: 40, width: 150, fontWeight: "bold" }}
              onClick={() => {
                setJoin(!join);
                setJoinRoom(true)
              }}
            >
              Join Room
            </Button>
          </Box>
          {
            join && (
              <Box
                m={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    enterRoom(roomId)
                  }}
                  style={{ marginRight: "0.5em" }}
                >
                  <TextField
                    id="outlined-basic"
                    label="roomid"
                    variant="filled"
                    autoComplete="off"
                    color="warning"
                    onChange={(e) => setRoomId(e.target.value.trim())}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: "10px", marginTop: "10px", fontWeight: "bolder" }}
                    onClick={() => socket.emit("is_room_exists", {roomId})}
                  >
                    join
                  </Button>
                </form>
                {joinloading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
              </Box>
            )
          }
        </div>
      </div>
  )
}

export default Home;