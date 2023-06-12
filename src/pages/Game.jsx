import React, {useState, useEffect} from "react"
import { useParams } from "react-router"
import { Typography } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';
import { Details } from "@mui/icons-material";


const Game = () => {
  const { roomid } = useParams()
  const [loading, setLoading] = useState(true)
  const [isRoomExists, setIsRoomExists] = useState(false)
  const [roomDetails, setRoomDetails] = useState()

  useEffect(() => {
    const getRoomDetails = async () => {
      const response = await fetch("http://localhost:8080/room/" + roomid, {
        method: "GET"
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setIsRoomExists(true)
        setRoomDetails(data)
      } else {
        setIsRoomExists(false)
      }
    }

    getRoomDetails()
    setLoading(false)
  }, [])

  return (
    (loading 
      ? 
      <CircularProgress />
      :
      (isRoomExists
        ?
        <Typography variant="subtitle1">
          Welcome to the Room, Room-ID: {roomid}
        </Typography>
        :
        <Typography variant="subtitle1">
          No room found with room-id: {roomid}
        </Typography>
      )
    )
  )
}

export default Game;