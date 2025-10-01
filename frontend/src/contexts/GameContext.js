import React, { createContext, useContext, useReducer } from "react";
import { playerAPI } from "../services/api";

// Initial state
const initialState = {
  currentGame: null,
  gameBoard: Array(5)
    .fill()
    .map(() => Array(5).fill({ letter: "", status: "empty" })),
  currentRow: 0,
  currentCol: 0,
  gameStatus: "playing", // 'playing', 'won', 'lost'
  isLoading: false,
  error: null,
  gamesPlayedToday: 0,
  maxGamesPerDay: 3,
};

// Action types
const GAME_ACTIONS = {
  START_GAME: "START_GAME",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_BOARD: "UPDATE_BOARD",
  MAKE_GUESS: "MAKE_GUESS",
  GAME_WON: "GAME_WON",
  GAME_LOST: "GAME_LOST",
  RESET_GAME: "RESET_GAME",
  SET_GAMES_PLAYED: "SET_GAMES_PLAYED",
  UPDATE_GAMES_PLAYED: "UPDATE_GAMES_PLAYED",
};

// Game status mapping
const GAME_STATUS_MAP = {
  CORRECT: "correct",
  PRESENT: "present",
  ABSENT: "absent",
};

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        currentGame: action.payload,
        gameBoard: Array(5)
          .fill()
          .map(() => Array(5).fill({ letter: "", status: "empty" })),
        currentRow: 0,
        currentCol: 0,
        gameStatus: "playing",
        isLoading: false,
        error: null,
      };

    case GAME_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case GAME_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case GAME_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case GAME_ACTIONS.UPDATE_BOARD:
      return {
        ...state,
        gameBoard: action.payload,
      };

    case GAME_ACTIONS.MAKE_GUESS:
      const { guess, feedback } = action.payload;
      const newBoard = [...state.gameBoard];

      // Update the current row with the guess and feedback
      for (let i = 0; i < 5; i++) {
        newBoard[state.currentRow][i] = {
          letter: guess[i],
          status: GAME_STATUS_MAP[feedback[i]] || "empty",
        };
      }

      return {
        ...state,
        gameBoard: newBoard,
        currentRow: state.currentRow + 1,
        currentCol: 0,
        isLoading: false,
      };

    case GAME_ACTIONS.GAME_WON:
      return {
        ...state,
        gameStatus: "won",
        isLoading: false,
      };

    case GAME_ACTIONS.GAME_LOST:
      return {
        ...state,
        gameStatus: "lost",
        isLoading: false,
      };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...state,
        currentGame: null,
        gameBoard: Array(5)
          .fill()
          .map(() => Array(5).fill({ letter: "", status: "empty" })),
        currentRow: 0,
        currentCol: 0,
        gameStatus: "playing",
        isLoading: false,
        error: null,
      };

    case GAME_ACTIONS.SET_GAMES_PLAYED:
      return {
        ...state,
        gamesPlayedToday: action.payload,
      };

    case GAME_ACTIONS.UPDATE_GAMES_PLAYED:
      return {
        ...state,
        gamesPlayedToday: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const GameContext = createContext();

// Game provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Start a new game
  const startGame = async (userId) => {
    try {
      // Check games played today first
      const gamesPlayedResponse = await playerAPI.getGamesPlayedToday(userId);
      const gamesPlayed = gamesPlayedResponse.data.length;

      if (gamesPlayed >= state.maxGamesPerDay) {
        dispatch({
          type: GAME_ACTIONS.SET_ERROR,
          payload: `You've reached the maximum limit of ${state.maxGamesPerDay} games per day.`,
        });
        return { success: false, error: "Daily limit reached" };
      }

      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: GAME_ACTIONS.CLEAR_ERROR });

      const response = await playerAPI.startGame(userId);
      console.log("GameContext: Start game response:", response.data);

      // Update games played count
      dispatch({
        type: GAME_ACTIONS.UPDATE_GAMES_PLAYED,
        payload: gamesPlayed + 1,
      });

      // Backend returns: { id, player, word, won, guessesAllowed, guessesMade, finished, startedAt, finishedAt }
      const gameData = response.data;

      // Extract the game information from the response (flat structure)
      const gameInfo = {
        id: gameData.id,
        targetWord: gameData.word.word,
        player: gameData.player,
        won: gameData.won,
        finished: gameData.finished,
        guessesAllowed: gameData.guessesAllowed,
        guessesMade: gameData.guessesMade,
        startedAt: gameData.startedAt,
        finishedAt: gameData.finishedAt,
      };

      dispatch({
        type: GAME_ACTIONS.START_GAME,
        payload: gameInfo,
      });

      return { success: true, game: gameInfo };
    } catch (error) {
      console.error("GameContext: Start game error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to start game";
      dispatch({
        type: GAME_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Make a guess
  const makeGuess = async (gameId, guess) => {
    try {
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: GAME_ACTIONS.CLEAR_ERROR });

      const response = await playerAPI.makeGuess(gameId, guess);
      console.log("GameContext: Make guess response:", response.data);

      // Backend returns: { id, game: {...}, guessedWord, feedback, guessedAt }
      const guessData = response.data;

      // Convert feedback format from "-O---" to ["ABSENT", "PRESENT", "ABSENT", "ABSENT", "ABSENT"]
      const feedbackArray = guessData.feedback.split("").map((char) => {
        switch (char) {
          case "G":
            return "CORRECT";
          case "O":
            return "PRESENT";
          case "-":
            return "ABSENT";
          default:
            return "ABSENT";
        }
      });

      // Check if game is over (makeGuess response has nested game object)
      const isGameOver = guessData.game.finished;
      const gameStatus = guessData.game.won
        ? "WON"
        : isGameOver
        ? "LOST"
        : "PLAYING";

      // Update board with feedback
      dispatch({
        type: GAME_ACTIONS.MAKE_GUESS,
        payload: { guess, feedback: feedbackArray },
      });

      // Check if game is over
      if (isGameOver) {
        if (gameStatus === "WON") {
          dispatch({ type: GAME_ACTIONS.GAME_WON });
        } else {
          dispatch({ type: GAME_ACTIONS.GAME_LOST });
        }
      }

      return { success: true, feedback: feedbackArray, gameStatus, isGameOver };
    } catch (error) {
      console.error("GameContext: Make guess error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to make guess";
      dispatch({
        type: GAME_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Get game status
  const getGameStatus = async (gameId) => {
    try {
      const response = await playerAPI.getGameStatus(gameId);
      console.log("GameContext: Get game status response:", response.data);

      // Backend returns the same flat format as start game
      const gameData = response.data;

      // Extract the game information from the response (flat structure)
      const gameInfo = {
        id: gameData.id,
        targetWord: gameData.word.word,
        player: gameData.player,
        won: gameData.won,
        finished: gameData.finished,
        guessesAllowed: gameData.guessesAllowed,
        guessesMade: gameData.guessesMade,
        startedAt: gameData.startedAt,
        finishedAt: gameData.finishedAt,
      };

      return { success: true, game: gameInfo };
    } catch (error) {
      console.error("GameContext: Get game status error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to get game status";
      return { success: false, error: errorMessage };
    }
  };

  // Reset game
  const resetGame = () => {
    dispatch({ type: GAME_ACTIONS.RESET_GAME });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: GAME_ACTIONS.CLEAR_ERROR });
  };

  // Set games played today
  const setGamesPlayedToday = (count) => {
    dispatch({ type: GAME_ACTIONS.SET_GAMES_PLAYED, payload: count });
  };

  // Add new function to check games played
  const checkGamesPlayedToday = async (userId) => {
    try {
      const response = await playerAPI.getGamesPlayedToday(userId);
      const gamesPlayed = response.data.length;
      dispatch({
        type: GAME_ACTIONS.UPDATE_GAMES_PLAYED,
        payload: gamesPlayed,
      });
      return {
        success: true,
        gamesPlayed,
        canPlay: gamesPlayed < state.maxGamesPerDay,
      };
    } catch (error) {
      console.error("Error checking games played:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    startGame,
    makeGuess,
    getGameStatus,
    resetGame,
    clearError,
    setGamesPlayedToday,
    checkGamesPlayedToday,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export default GameContext;
