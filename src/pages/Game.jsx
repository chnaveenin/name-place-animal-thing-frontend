import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { Alert, Typography } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Gameplay from "../components/Gameplay";


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
        setIsRoomExists(true)
        setRoomDetails(data)
      } else {
        setIsRoomExists(false)
      }
      setLoading(false)
    }

    getRoomDetails()
  }, [])

  const columns = [
    { id: 'name', label: 'Name', minWidth: "4em" },
    { id: 'score', label: 'Score', minWidth: "2em" }
  ]

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    (loading
      ?
      <CircularProgress />
      :
      (isRoomExists
        ?
        <>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <Paper sx={{ width: "25em", overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" sx={{backgroundColor: "aliceblue"}}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="left"
                          style={{ minWidth: column.minWidth, fontWeight: "bolder" }}
                          sx={{backgroundColor: "aliceblue"}}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roomDetails.participants.sort((a, b) => b.score - a.score)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={roomDetails.participants.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{backgroundColor: "aliceblue"}}
              />
            </Paper>
          </div>
          <Gameplay />
        </>
        :
        <Alert severity="error" variant="subtitle1">
          No room found with room-id: {roomid}
        </Alert>
      )
    )
  )
}

export default Game;