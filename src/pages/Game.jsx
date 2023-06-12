import React, {useState, useEffect} from "react"
import { useParams } from "react-router"
import { Typography } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';


const Game = () => {
  const { roomid } = useParams()
  const [loading, setLoading] = useState(true)
  const [isRoomExists, setIsRoomExists] = useState(true)

  useEffect(() => {
    // check from backend if the room exists
    setIsRoomExists(false)
    setLoading(false)
  }) 

  return (
    loading 
      ? 
      <CircularProgress />
      :
      isRoomExists
        ?
        <Typography variant="subtitle1">
          Welcome to the Room, Room-ID: {roomid}
        </Typography>
        :
        <Typography variant="subtitle1">
          No room found with room-id: {roomid}
        </Typography>
  )
}

export default Game;