import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
// import { motion } from 'framer-motion'; // Reserved for future animations
import {
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useGame } from "../contexts/GameContext";
import WordleBoard from "../components/player/WordleBoard";

const PlayerDashboard = () => {
  const [currentGuess, setCurrentGuess] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isCountLoading, setIsCountLoading] = useState(false);

  const { user, logout, isLoading: authLoading } = useAuth();
  const {
    currentGame,
    gameBoard,
    currentRow,
    gameStatus,
    isLoading,
    error,
    gamesPlayedToday,
    maxGamesPerDay,
    startGame,
    makeGuess,
    resetGame,
    clearError,
    checkGamesPlayedToday, // Add this
  } = useGame();

  // Check if user can play more games today
  const canPlayMore = gamesPlayedToday < maxGamesPerDay;

  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      const message =
        gameStatus === "won"
          ? `Congratulations! You guessed the word in ${currentRow} tries!`
          : `Game Over!`;

      setResultMessage(message);
      setShowResultDialog(true);
    }
  }, [gameStatus, currentRow, currentGame]);

  // Add useEffect to fetch games played when component mounts
  useEffect(() => {
    const fetchGamesPlayed = async () => {
      if (user?.id) {
        const result = await checkGamesPlayedToday(user.id);
        if (!result.success) {
          console.error("Failed to fetch games played:", result.error);
        }
      }
    };

    fetchGamesPlayed();
  }, [user]);

  //   console.log(
  //     "PlayerDashboard: Rendering with user:",
  //     user,
  //     "authLoading:",
  //     authLoading
  //   );

  // Show loading if user data is not available
  if (authLoading || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Update the refreshGamesCount function
  const refreshGamesCount = async () => {
    if (user?.id) {
      setIsCountLoading(true);
      try {
        console.log("Refreshing games played count for user:", user.id);
        const result = await checkGamesPlayedToday(user.id);
        console.log("Finished refreshing games count: ", result);
        if (!result.success) {
          console.error("Failed to refresh games count:", result.error);
        }
      } finally {
        setIsCountLoading(false);
      }
    }
  };

  const handleStartGame = async () => {
    if (!canPlayMore) {
      return;
    }

    const result = await startGame(user.id);
    if (result.success) {
      setCurrentGuess("");
      // Refresh the games count after starting a new game
      await refreshGamesCount();
    }
  };

  const handleGuessChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 5 && /^[A-Z]*$/.test(value)) {
      setCurrentGuess(value);
    }
  };

  const handleSubmitGuess = async () => {
    if (currentGuess.length !== 5 || !currentGame) {
      return;
    }

    setIsAnimating(true);
    const result = await makeGuess(currentGame.id, currentGuess);

    if (result.success) {
      setCurrentGuess("");
      // Animation will complete after a delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } else {
      setIsAnimating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitGuess();
    }
  };

  const handleNewGame = () => {
    setShowResultDialog(false);
    resetGame();
    setCurrentGuess("");
  };

  const handleLogout = () => {
    logout();
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case "won":
        return "success";
      case "lost":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#6aaa64" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wordle - Player Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Game Stats */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Games Today:{" "}
              {isCountLoading ? (
                <CircularProgress size={20} sx={{ ml: 1 }} />
              ) : (
                `${gamesPlayedToday}/${maxGamesPerDay}`
              )}
            </Typography>
            <IconButton onClick={refreshGamesCount} size="small">
              <RefreshIcon />
            </IconButton>
          </Box>
          {/* Warning below the box */}
          {!canPlayMore && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You've reached your daily limit of {maxGamesPerDay} games.
            </Alert>
          )}
        </Paper>

        {/* Game Board */}
        {canPlayMore && (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#6aaa64", fontWeight: "bold" }}
            >
              WORDLE
            </Typography>

            {currentGame ? (
              <>
                <WordleBoard
                  gameBoard={gameBoard}
                  currentRow={currentRow}
                  isAnimating={isAnimating}
                />

                {/* Game Status */}
                {gameStatus !== "playing" && (
                  <Alert severity={getStatusColor()} sx={{ mt: 2 }}>
                    {gameStatus === "won" ? "You won!" : "Game over!"}
                  </Alert>
                )}

                {/* Guess Input */}
                {gameStatus === "playing" && currentRow < 5 && (
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      value={currentGuess}
                      onChange={handleGuessChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Your guess"
                      variant="outlined"
                      inputProps={{
                        maxLength: 5,
                        style: {
                          textAlign: "center",
                          fontSize: "1.25rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                        },
                      }}
                      sx={{
                        width: 200,
                        "& .MuiOutlinedInput-root": {
                          fontSize: "1.5rem",
                        },
                      }}
                      disabled={isLoading}
                    />

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSubmitGuess}
                        disabled={currentGuess.length !== 5 || isLoading}
                        sx={{
                          backgroundColor: "#6aaa64",
                          "&:hover": { backgroundColor: "#5a9a54" },
                          px: 4,
                          py: 1.5,
                          fontSize: "1.1rem",
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Submit Guess"
                        )}
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Ready to play Wordle?
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartGame}
                  disabled={!canPlayMore || isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={20} /> : <RefreshIcon />
                  }
                  sx={{
                    backgroundColor: "#6aaa64",
                    "&:hover": { backgroundColor: "#5a9a54" },
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                  }}
                >
                  {isLoading ? "Starting..." : "Start New Game"}
                </Button>
              </Box>
            )}
          </Paper>
        )}
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}
      </Container>

      {/* Result Dialog */}
      <Dialog
        open={showResultDialog}
        onClose={() => setShowResultDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {gameStatus === "won" ? "🎉 Congratulations!" : "😔 Game Over"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{resultMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResultDialog(false)}>Close</Button>
          {canPlayMore && (
            <Button
              onClick={handleNewGame}
              variant="contained"
              sx={{ backgroundColor: "#6aaa64" }}
            >
              New Game
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayerDashboard;
