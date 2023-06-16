import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { Alert, Snackbar, Typography } from "@mui/material"
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
import { useSocketContext } from "../hooks/useSocketContext";

const Game = () => {
  const socket = useSocketContext();

  const { roomid } = useParams();
  const [isRoomExists, setIsRoomExists] = useState(true);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState("");

  const [person, setPerson] = useState();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const getPeople = async () => {
      console.log(("here"));
      await socket.on("peopleInRoom", (data) => {
        console.log("peopleData", data);
        setPeople(data);
        setIsRoomExists(true);
        setPerson(data.find((p) => p.socketId === socket.id))
      });
      setLoading(false);
    }

    getPeople();

    socket.on("receive_message", (data) => {
      if (data.author === "System") {
        setWelcome(data.message);
        console.log(data.message);
        setOpen(true);
      }
    });

    return () => {
      socket.off("peopleInRoom");
      socket.off("receive_message");
    }
  }, [socket])

  const columns = [
    { id: 'name', label: 'Name', minWidth: "4em" },
    { id: 'score', label: 'Score', minWidth: "2em" }
  ]

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
          <Typography style={{ width: "100%", textAlign: "center", marginBottom: "1em" }} variant="h5">RoomID: {roomid}</Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Paper sx={{ width: "25em", overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "aliceblue" }}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell className="tableCell"
                          key={column.id}
                          align="left"
                          style={{ minWidth: column.minWidth, fontWeight: "bolder" }}
                          sx={{ backgroundColor: "aliceblue" }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {people.sort((a, b) => b.score - a.score)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell className="tableCell" key={column.id} align={column.align}>
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={people.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ backgroundColor: "aliceblue" }}
              />
            </Paper>
          </div>
          <Gameplay isTurn={person?.isTurn}/>
          {welcome &&
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
            >
              <Alert 
                severity="info" 
                sx={{ width: '20' }}
              >
                {welcome}
              </Alert>
            </Snackbar>
          }
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