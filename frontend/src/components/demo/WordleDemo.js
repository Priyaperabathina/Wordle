import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import WordleBoard from '../player/WordleBoard';

/**
 * Demo component to showcase the Wordle board with sample data
 */
const WordleDemo = () => {
    const [demoBoard, setDemoBoard] = useState([
        [
            { letter: 'G', status: 'correct' },
            { letter: 'R', status: 'correct' },
            { letter: 'A', status: 'correct' },
            { letter: 'N', status: 'correct' },
            { letter: 'A', status: 'correct' }
        ],
        [
            { letter: 'A', status: 'present' },
            { letter: 'P', status: 'absent' },
            { letter: 'P', status: 'absent' },
            { letter: 'L', status: 'absent' },
            { letter: 'E', status: 'absent' }
        ],
        [
            { letter: 'B', status: 'absent' },
            { letter: 'R', status: 'correct' },
            { letter: 'A', status: 'present' },
            { letter: 'I', status: 'absent' },
            { letter: 'N', status: 'absent' }
        ],
        [
            { letter: 'C', status: 'absent' },
            { letter: 'R', status: 'correct' },
            { letter: 'A', status: 'present' },
            { letter: 'N', status: 'correct' },
            { letter: 'E', status: 'absent' }
        ],
        [
            { letter: 'D', status: 'absent' },
            { letter: 'R', status: 'correct' },
            { letter: 'A', status: 'present' },
            { letter: 'M', status: 'absent' },
            { letter: 'A', status: 'correct' }
        ]
    ]);

    const [isAnimating, setIsAnimating] = useState(false);

    const animateDemo = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, 2000);
    };

    const resetDemo = () => {
        setDemoBoard([
            [
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' }
            ],
            [
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' }
            ],
            [
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' }
            ],
            [
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' }
            ],
            [
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' },
                { letter: '', status: 'empty' }
            ]
        ]);
    };

    const showProgressiveDemo = () => {
        // Reset first
        resetDemo();

        // Show progressive reveals
        setTimeout(() => {
            setDemoBoard(prev => {
                const newBoard = [...prev];
                newBoard[0] = [
                    { letter: 'A', status: 'present' },
                    { letter: 'P', status: 'absent' },
                    { letter: 'P', status: 'absent' },
                    { letter: 'L', status: 'absent' },
                    { letter: 'E', status: 'absent' }
                ];
                return newBoard;
            });
        }, 500);

        setTimeout(() => {
            setDemoBoard(prev => {
                const newBoard = [...prev];
                newBoard[1] = [
                    { letter: 'B', status: 'absent' },
                    { letter: 'R', status: 'correct' },
                    { letter: 'A', status: 'present' },
                    { letter: 'I', status: 'absent' },
                    { letter: 'N', status: 'absent' }
                ];
                return newBoard;
            });
        }, 1000);

        setTimeout(() => {
            setDemoBoard(prev => {
                const newBoard = [...prev];
                newBoard[2] = [
                    { letter: 'C', status: 'absent' },
                    { letter: 'R', status: 'correct' },
                    { letter: 'A', status: 'present' },
                    { letter: 'N', status: 'correct' },
                    { letter: 'E', status: 'absent' }
                ];
                return newBoard;
            });
        }, 1500);

        setTimeout(() => {
            setDemoBoard(prev => {
                const newBoard = [...prev];
                newBoard[3] = [
                    { letter: 'D', status: 'absent' },
                    { letter: 'R', status: 'correct' },
                    { letter: 'A', status: 'present' },
                    { letter: 'M', status: 'absent' },
                    { letter: 'A', status: 'correct' }
                ];
                return newBoard;
            });
        }, 2000);

        setTimeout(() => {
            setDemoBoard(prev => {
                const newBoard = [...prev];
                newBoard[4] = [
                    { letter: 'G', status: 'correct' },
                    { letter: 'R', status: 'correct' },
                    { letter: 'A', status: 'correct' },
                    { letter: 'N', status: 'correct' },
                    { letter: 'A', status: 'correct' }
                ];
                return newBoard;
            });
        }, 2500);
    };

    return (
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#6aaa64', fontWeight: 'bold' }}>
                Wordle Board Demo
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                This is a demonstration of the animated Wordle board component.
                The target word is "GRANA" (Spanish for "grain").
                <br />
                <strong>Current State:</strong> Shows the final result with all guesses
                <br />
                <strong>Progressive Demo:</strong> Shows how the game progresses step by step
                <br />
                <strong>Animate Board:</strong> Triggers the letter flip animations
            </Typography>

            <WordleBoard
                gameBoard={demoBoard}
                currentRow={4}
                isAnimating={isAnimating}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    onClick={animateDemo}
                    sx={{ backgroundColor: '#6aaa64', '&:hover': { backgroundColor: '#5a9a54' } }}
                >
                    Animate Board
                </Button>
                <Button
                    variant="contained"
                    onClick={showProgressiveDemo}
                    sx={{ backgroundColor: '#c9b458', '&:hover': { backgroundColor: '#b9a448' } }}
                >
                    Progressive Demo
                </Button>
                <Button
                    variant="outlined"
                    onClick={resetDemo}
                >
                    Reset Board
                </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                    Color Legend:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: '#6aaa64', borderRadius: 1 }} />
                        <Typography variant="body2">Green: Correct letter in correct position</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: '#c9b458', borderRadius: 1 }} />
                        <Typography variant="body2">Yellow: Correct letter in wrong position</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: '#787c7e', borderRadius: 1 }} />
                        <Typography variant="body2">Gray: Letter not in the word</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default WordleDemo;
