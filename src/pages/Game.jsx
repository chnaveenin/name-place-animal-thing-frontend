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
  const [turningPerson, setTurningPerson] = useState();

  const [open, setOpen] = useState(false);
  const [calculate, setCalculate] = useState(false);


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
        setPerson(data.find((p) => p.socketId === socket.id));
        setTurningPerson(data.find((p) => p.isTurn));
      });
      setLoading(false);
    }

    getPeople();

    socket.on("welcome_message", (data) => {
      if (data.author === "System") {
        setWelcome(data.message);
        console.log(data.message);
        setOpen(true);
      }
    });

    socket.on("calculate_score", (data) => {
      console.log("peopleData from calculate_score", data);
      setPeople(data);
      setCalculate(true);
    });

    return () => {
      socket.off("peopleInRoom");
      socket.off("welcome_message");
    }
  }, [socket])

  const columns = [
    { id: 'name', label: 'Name', minWidth: "4em" },
    { id: 'score', label: 'Score', minWidth: "2em" }
  ]

  const score_columns = [
    { id: 'name', label: 'Name', minWidth: "3em" },
    { id: 'submission.name', label: 'Name', minWidth: "2em", render: (rowData) => rowData.submission.name },
    { id: 'submission.place', label: 'Place', minWidth: "2em", render: (rowData) => rowData.submission.place },
    { id: 'submission.animal', label: 'Animal', minWidth: "2em", render: (rowData) => rowData.submission.animal },
    { id: 'submission.thing', label: 'Thing', minWidth: "2em", render: (rowData) => rowData.submission.thing },
    { id: 'score', label: 'Score', minWidth: "1em" }
  ];  

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
          {(!calculate || !person?.isTurn) &&
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Paper sx={{ width: "20em", overflow: 'hidden' }}>
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
                  labelRowsPerPage={"Rows"}
                  count={people.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ backgroundColor: "aliceblue" }}
                />
              </Paper>
            </div>
          }
          <Gameplay room={roomid} isTurn={person?.isTurn} turn={turningPerson?.name} />
          {calculate &&
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Paper sx={{ width: "100%", overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "aliceblue" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={1}>
                        </TableCell>
                        <TableCell align="center" colSpan={4}>
                          Submission
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {score_columns.map((column) => (
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
                      {people
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          return (
                            <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                              {score_columns.map((column) => {
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
                  labelRowsPerPage={"Rows"}
                  count={people.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ backgroundColor: "aliceblue" }}
                />
              </Paper>
            </div>
          }
          {welcome &&
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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