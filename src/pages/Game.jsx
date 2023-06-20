import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { useSocketContext } from "../hooks/useSocketContext";
import {
  Alert, 
  Button, 
  CircularProgress,
  FormControl, 
  MenuItem, 
  Paper,
  Select, 
  Snackbar, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography 
} from "@mui/material"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Gameplay from "../components/Gameplay";
import { Box } from "@mui/system";

const Game = () => {
  const socket = useSocketContext();

  const { roomid } = useParams();
  const [isRoomExists, setIsRoomExists] = useState(true);
  const [people, setPeople] = useState([]);
  const [sortedPeople, setSortedPeople] = useState([]);
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
    socket.on("peopleInRoom", (data) => {
      console.log("peopleData", data);
      setPeople(data);
      setIsRoomExists(true);
      setPerson(data.find((p) => p.socketId === socket.id));
      setTurningPerson(data.find((p) => p.isTurn));
    });

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

    socket.on("calculated_score", () => {
      setCalculate(false);
      console.log("calculated score");
      socket.emit("change_turn", { room: roomid });
    });

    socket.on("change_turn", () => {
      setCalculate(false);
    });

    return () => {
      socket.off("peopleInRoom");
      socket.off("welcome_message");
      socket.off("calculate_score");
      socket.off("calculated_score");
      socket.off("change_turn");
    }
  }, [socket])

  useEffect(() => {
    const sortedData = [...people].sort((a, b) => b.score - a.score);
    setSortedPeople(sortedData);
  }, [people]);

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
    { id: '', label: 'Score', minWidth: "1em" }
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

  const handleSubmitScore = () => {
    socket.emit("calculate_score", { people, roomid });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomid)
      .catch((error) => {
        alert('Failed to copy text: ', error);
      });
  };

  return (
    (loading
      ?
      <CircularProgress />
      :
      (isRoomExists
        ?
        <>
          <Typography
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: "1em"
            }}
            variant="h5"
          >
            RoomID: {roomid}
            <Button
              onClick={handleCopyToClipboard}
              sx={{ paddingBottom: "0.75em" }}
            >
              <ContentCopyIcon
                fontSize="small"
              />
            </Button>
          </Typography>
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
                      {sortedPeople
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
            <div style={{ marginTop: "1em" }}>
              <Paper sx={{ width: "100%", overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "aliceblue" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={1} sx={{ backgroundColor: "aliceblue" }}>
                        </TableCell>
                        <TableCell align="center" colSpan={4} sx={{ backgroundColor: "aliceblue" }}>
                          Submission
                        </TableCell>
                        {person?.isTurn &&
                          <TableCell align="center" colSpan={1} sx={{ backgroundColor: "aliceblue" }}>
                          </TableCell>
                        }
                      </TableRow>
                      <TableRow>
                        {score_columns.map((column) => (
                          (column.id || person?.isTurn) &&
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
                                return (
                                  (column.id || person?.isTurn) &&
                                  <TableCell className="tableCell" key={column.id} align={column.align}>
                                    {column.id ?
                                      (column.render ? column.render(row) ? column.render(row) : '--' : row[column.id])
                                      :
                                      person?.isTurn &&
                                      <FormControl>
                                        <Select
                                          sx={{ height: "2em", minWidth: "2em" }}
                                          defaultValue={0}
                                          onChange={(e) => setPeople((pv) => {
                                            const person = pv[index];
                                            const updatedPerson = { ...person, newScore: e.target.value };
                                            pv[index] = updatedPerson;
                                            return pv;
                                          })}
                                          autoWidth
                                          label="Score"
                                        >
                                          <MenuItem value={0}>0</MenuItem>
                                          <MenuItem value={5}>5</MenuItem>
                                          <MenuItem value={10}>10</MenuItem>
                                          <MenuItem value={15}>15</MenuItem>
                                          <MenuItem value={20}>20</MenuItem>
                                          <MenuItem value={25}>25</MenuItem>
                                          <MenuItem value={30}>30</MenuItem>
                                          <MenuItem value={35}>35</MenuItem>
                                          <MenuItem value={40}>40</MenuItem>
                                        </Select>
                                      </FormControl>
                                    }
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
              {person?.isTurn &&
                <Box
                  display="flex"
                  justifyContent="right"
                >
                  <Button
                    variant="outlined"
                    sx={{ marginTop: "1.5em", borderBottom: "2px solid" }}
                    onClick={handleSubmitScore}
                  >
                    Submit
                  </Button>
                </Box>
              }
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