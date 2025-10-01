import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { adminAPI } from "../../services/api";

const Reports = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [playerReport, setPlayerReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);

  const fetchDailyReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getDailyReport(date.toISOString());
      setDailyReport(response.data);
    } catch (error) {
      setError("Failed to fetch daily report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchPlayerReport function
  const fetchPlayerReport = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getPlayerReport(userId);
      const formattedData = response.data.map((game) => ({
        date: dayjs(game.date).format("YYYY-MM-DD"),
        wordsTried: game.attempts,
        correctGuesses: game.wins,
        successRate: ((game.wins / game.attempts) * 100).toFixed(2),
      }));
      setPlayerReport({ games: formattedData });
    } catch (error) {
      setError("Failed to fetch user report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this new function to fetch players
  const fetchPlayers = async () => {
    try {
      const response = await adminAPI.getPlayers(); // You'll need to add this endpoint to your API
      setPlayers(response.data);
    } catch (error) {
      setError("Failed to fetch players: " + error.message);
    }
  };

  useEffect(() => {
    fetchDailyReport(selectedDate);
    fetchPlayers(); // Fetch players when component mounts
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Daily Report Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Daily Report
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
            />
            <Button
              variant="contained"
              onClick={() => fetchDailyReport(selectedDate.toDate())}
              disabled={loading}
            >
              Get Report
            </Button>
          </Box>

          {dailyReport && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Total Users</TableCell>
                    <TableCell>Total Games</TableCell>
                    <TableCell>Games Won</TableCell>
                    <TableCell>Success Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{dailyReport.totalUsers}</TableCell>
                    <TableCell>{dailyReport.totalGames}</TableCell>
                    <TableCell>{dailyReport.gamesWon}</TableCell>
                    <TableCell>
                      {(
                        (dailyReport.gamesWon / dailyReport.totalGames) *
                        100
                      ).toFixed(2)}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Player Report Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Player Statistics
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="player-select-label">Select Player</InputLabel>
              <Select
                labelId="player-select-label"
                value={userId}
                label="Select Player"
                onChange={(e) => setUserId(e.target.value)}
              >
                {players.map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.username}{" "}
                    {/* Adjust the property name based on your API response */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => fetchPlayerReport(userId)}
              disabled={loading || !userId}
            >
              Get Player Report
            </Button>
          </Box>

          {playerReport && playerReport.games.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Words Attempted</TableCell>
                    <TableCell align="right">Words Guessed Correctly</TableCell>
                    <TableCell align="right">Success Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playerReport.games.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell>{game.date}</TableCell>
                      <TableCell align="right">{game.wordsTried}</TableCell>
                      <TableCell align="right">{game.correctGuesses}</TableCell>
                      <TableCell align="right">{game.successRate}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    sx={{
                      "& td": {
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell>Total</TableCell>
                    <TableCell align="right">
                      {playerReport.games.reduce(
                        (sum, game) => sum + game.wordsTried,
                        0
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {playerReport.games.reduce(
                        (sum, game) => sum + game.correctGuesses,
                        0
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {(
                        (playerReport.games.reduce(
                          (sum, game) => sum + game.correctGuesses,
                          0
                        ) /
                          playerReport.games.reduce(
                            (sum, game) => sum + game.wordsTried,
                            0
                          )) *
                        100
                      ).toFixed(2)}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : playerReport ? (
            <Alert severity="info">No games found for this user.</Alert>
          ) : null}
        </Paper>

        {loading && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
