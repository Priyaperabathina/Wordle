import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WordleDemo from '../components/demo/WordleDemo';

const DemoPage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#6aaa64', fontWeight: 'bold' }}>
                    Wordle Clone Demo
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Experience the animated Wordle board component
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        sx={{ backgroundColor: '#6aaa64', '&:hover': { backgroundColor: '#5a9a54' } }}
                    >
                        Login to Play
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="outlined"
                    >
                        Create Account
                    </Button>
                </Box>
            </Box>

            <WordleDemo />

            <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    🎮 How to Play
                </Typography>
                <Typography variant="body1" paragraph>
                    Wordle is a word-guessing game where you have 6 attempts to guess a 5-letter word.
                </Typography>
                <Typography variant="body1" paragraph>
                    After each guess, the letters will be colored to give you hints:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                    <li><strong>Green:</strong> The letter is correct and in the right position</li>
                    <li><strong>Yellow:</strong> The letter is in the word but in the wrong position</li>
                    <li><strong>Gray:</strong> The letter is not in the word at all</li>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Use these clues to narrow down your next guess and solve the puzzle!
                </Typography>
            </Box>
        </Container>
    );
};

export default DemoPage;
