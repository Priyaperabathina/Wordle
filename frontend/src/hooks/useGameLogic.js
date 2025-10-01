import { useState, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for managing game logic and interactions
 */
export const useGameLogic = () => {
    const { user } = useAuth();
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
    } = useGame();

    const [currentGuess, setCurrentGuess] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    // Check if user can play more games today
    const canPlayMore = gamesPlayedToday < maxGamesPerDay;

    // Check if game is active
    const isGameActive = currentGame && gameStatus === 'playing';

    // Check if current row is full
    const isCurrentRowFull = currentRow >= 5;

    // Check if game is over
    const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

    /**
     * Start a new game
     */
    const handleStartGame = useCallback(async () => {
        if (!canPlayMore || !user?.id) {
            return { success: false, error: 'Cannot start game' };
        }

        const result = await startGame(user.id);
        if (result.success) {
            setCurrentGuess('');
            setIsAnimating(false);
        }
        return result;
    }, [canPlayMore, user?.id, startGame]);

    /**
     * Handle guess input change
     */
    const handleGuessChange = useCallback((value) => {
        const upperValue = value.toUpperCase();
        if (upperValue.length <= 5 && /^[A-Z]*$/.test(upperValue)) {
            setCurrentGuess(upperValue);
        }
    }, []);

    /**
     * Submit a guess
     */
    const handleSubmitGuess = useCallback(async () => {
        if (currentGuess.length !== 5 || !currentGame || !isGameActive) {
            return { success: false, error: 'Invalid guess or game state' };
        }

        setIsAnimating(true);
        const result = await makeGuess(currentGame.id, currentGuess);

        if (result.success) {
            setCurrentGuess('');
            // Animation will complete after a delay
            setTimeout(() => {
                setIsAnimating(false);
            }, 1000);
        } else {
            setIsAnimating(false);
        }

        return result;
    }, [currentGuess, currentGame, isGameActive, makeGuess]);

    /**
     * Handle keyboard input
     */
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSubmitGuess();
        }
    }, [handleSubmitGuess]);

    /**
     * Reset the current game
     */
    const handleResetGame = useCallback(() => {
        resetGame();
        setCurrentGuess('');
        setIsAnimating(false);
    }, [resetGame]);

    /**
     * Get game statistics
     */
    const getGameStats = useCallback(() => {
        if (!currentGame) return null;

        return {
            gameId: currentGame.id,
            targetWord: currentGame.targetWord,
            currentRow,
            totalRows: 5,
            remainingRows: 5 - currentRow,
            isGameOver,
            gameStatus,
            canPlayMore,
            gamesPlayedToday,
            maxGamesPerDay,
        };
    }, [currentGame, currentRow, isGameOver, gameStatus, canPlayMore, gamesPlayedToday, maxGamesPerDay]);

    /**
     * Get board state for rendering
     */
    const getBoardState = useCallback(() => {
        return {
            gameBoard,
            currentRow,
            isAnimating,
            isGameActive,
            isGameOver,
        };
    }, [gameBoard, currentRow, isAnimating, isGameActive, isGameOver]);

    /**
     * Get input state for rendering
     */
    const getInputState = useCallback(() => {
        return {
            currentGuess,
            canSubmit: currentGuess.length === 5 && isGameActive && !isLoading,
            isDisabled: !isGameActive || isLoading || isGameOver,
        };
    }, [currentGuess, isGameActive, isLoading, isGameOver]);

    return {
        // Game state
        currentGame,
        gameBoard,
        currentRow,
        gameStatus,
        isLoading,
        error,

        // Computed state
        canPlayMore,
        isGameActive,
        isCurrentRowFull,
        isGameOver,

        // Input state
        currentGuess,
        isAnimating,

        // Actions
        handleStartGame,
        handleGuessChange,
        handleSubmitGuess,
        handleKeyPress,
        handleResetGame,
        clearError,

        // Getters
        getGameStats,
        getBoardState,
        getInputState,
    };
};

export default useGameLogic;

