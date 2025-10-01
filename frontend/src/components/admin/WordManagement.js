import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';

const WordManagement = () => {
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Dialog states
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // Form states
    const [newWord, setNewWord] = useState('');

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminAPI.getWords();
            setWords(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch words');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddWord = async () => {
        if (!newWord.trim()) {
            setError('Please enter a word');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await adminAPI.createWord({ word: newWord.toUpperCase() });
            setSuccess('Word added successfully');
            setNewWord('');
            setAddDialogOpen(false);
            fetchWords();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add word');
        } finally {
            setIsLoading(false);
        }
    };


    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                    Word Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{ backgroundColor: '#6aaa64', '&:hover': { backgroundColor: '#5a9a54' } }}
                >
                    Add Word
                </Button>
            </Box>

            {/* Messages */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
                    {success}
                </Alert>
            )}

            {/* Words Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Word</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : words.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary">No words found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            words.map((word) => (
                                <motion.tr
                                    key={word.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TableCell>{word.id}</TableCell>
                                    <TableCell>
                                        <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                                            {word.word}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={word.isActive ? 'Active' : 'Inactive'}
                                            color={word.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {word.createdBy?.username || 'Unknown'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(word.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </motion.tr>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Word Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Word</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Word"
                        fullWidth
                        variant="outlined"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                        inputProps={{ maxLength: 5 }}
                        helperText="Enter a 5-letter word"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddWord}
                        variant="contained"
                        disabled={isLoading}
                        sx={{ backgroundColor: '#6aaa64' }}
                    >
                        {isLoading ? <CircularProgress size={20} /> : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default WordManagement;
