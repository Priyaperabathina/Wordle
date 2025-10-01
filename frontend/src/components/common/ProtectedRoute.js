import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Debug logging
    console.log('ProtectedRoute Debug:', {
        isAuthenticated,
        isLoading,
        user,
        requiredRole,
        location: location.pathname
    });

    // Show loading spinner while checking authentication
    if (isLoading) {
        console.log('ProtectedRoute: Showing loading spinner');
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

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        console.log('ProtectedRoute: Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (requiredRole && user?.role !== requiredRole) {
        console.log('ProtectedRoute: Role mismatch, redirecting to appropriate dashboard');
        // If user is undefined, redirect to demo page to avoid infinite loop
        if (!user) {
            console.log('ProtectedRoute: User is undefined, redirecting to demo');
            return <Navigate to="/demo" replace />;
        }
        // Redirect to appropriate dashboard based on user role
        const redirectPath = user?.role === 'ADMIN' ? '/admin' : '/player';
        return <Navigate to={redirectPath} replace />;
    }

    console.log('ProtectedRoute: Rendering children');
    return children;
};

export default ProtectedRoute;

