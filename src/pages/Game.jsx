import { Typography } from "@mui/material"
import React from "react"
import { useParams } from "react-router"

const Game = () => {
  const { roomid } = useParams() 
  return (
    <Typography variant="subtitle1">
      Welcome to the Room, Room-ID: {roomid}
    </Typography>
  )
}

export default Game;