import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import WordManagement from '../components/admin/WordManagement';
import Reports from '../components/admin/Reports';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { user, logout, isLoading } = useAuth();

    console.log('AdminDashboard: Rendering with user:', user, 'isLoading:', isLoading);

    // Show loading if user data is not available
    if (isLoading || !user) {
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

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleLogout = () => {
        logout();
    };

    const TabPanel = ({ children, value, index, ...other }) => {
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`admin-tabpanel-${index}`}
                aria-labelledby={`admin-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* App Bar */}
            <AppBar position="static" sx={{ backgroundColor: '#6aaa64' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Wordle - Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Welcome, {user?.username}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: '#6aaa64', fontWeight: 'bold' }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage words and view game reports
                    </Typography>
                </Paper>

                {/* Tabs */}
                <Paper sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin tabs">
                            <Tab label="Word Management" />
                            <Tab label="Reports" />
                        </Tabs>
                    </Box>

                    <TabPanel value={activeTab} index={0}>
                        <WordManagement />
                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                        <Reports />
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
