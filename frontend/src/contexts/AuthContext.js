import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOGOUT: 'LOGOUT',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing token on app load
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const user = localStorage.getItem('user');

        console.log('AuthContext: Checking existing auth on app load', {
            token: !!token,
            user: !!user,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'None'
        });

        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                console.log('AuthContext: Found existing auth, restoring state', { parsedUser });
                console.log('AuthContext: Restored token:', token ? 'Present' : 'Missing');
                dispatch({
                    type: AUTH_ACTIONS.LOGIN_SUCCESS,
                    payload: { user: parsedUser, token },
                });
            } catch (error) {
                console.log('AuthContext: Error parsing stored user, clearing auth');
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user');
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        } else {
            console.log('AuthContext: No existing auth found');
            console.log('AuthContext: Token in localStorage:', token ? 'Present' : 'Missing');
            console.log('AuthContext: User in localStorage:', user ? 'Present' : 'Missing');
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });
            console.log('AuthContext: Attempting login with credentials:', credentials);

            const response = await authAPI.login(credentials);
            console.log('AuthContext: Login API response:', response);
            console.log('AuthContext: Response data:', response.data);
            console.log('AuthContext: Response data keys:', Object.keys(response.data));

            const { token, user, userId, username } = response.data;

            // Handle the specific backend response format
            // Backend returns: { token, userId, username }
            let userData;
            if (userId && username) {
                // Backend format: userId and username are separate fields
                // Try to extract role from JWT token if not in response
                let role = response.data.role;
                if (!role && token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        role = payload.role;
                    } catch (e) {
                        console.log('Could not decode JWT token for role');
                    }
                }

                userData = {
                    id: userId,
                    username: username,
                    role: role || 'PLAYER'
                };
            } else if (user && typeof user === 'object') {
                // Standard format: user is an object
                userData = user;
            } else {
                // Fallback: create minimal user object
                userData = {
                    id: userId || response.data.userId || response.data.id || 'unknown',
                    username: username || user || credentials.username,
                    role: response.data.role || 'PLAYER'
                };
            }
            console.log('AuthContext: Extracted user data:', userData);

            // Store in localStorage
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            console.log('AuthContext: Token saved to localStorage:', token ? 'Yes' : 'No');
            console.log('AuthContext: User data saved to localStorage:', userData);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: userData, token },
            });

            console.log('Login successful:', { user: userData, token });
            return { success: true, user: userData };
        } catch (error) {
            console.error('AuthContext: Login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.REGISTER_START });
            console.log('AuthContext: Attempting register with userData:', userData);

            const response = await authAPI.register(userData);
            console.log('AuthContext: Register API response:', response);
            console.log('AuthContext: Response data:', response.data);
            console.log('AuthContext: Response data keys:', Object.keys(response.data));

            const { token, user, userId, username } = response.data;

            // Handle the specific backend response format
            // Backend returns: { token, userId, username }
            let extractedUserData;
            if (userId && username) {
                // Backend format: userId and username are separate fields
                // Try to extract role from JWT token if not in response
                let role = response.data.role || userData.role;
                if (!role && token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        role = payload.role;
                    } catch (e) {
                        console.log('Could not decode JWT token for role');
                    }
                }

                extractedUserData = {
                    id: userId,
                    username: username,
                    role: role || 'PLAYER'
                };
            } else if (user && typeof user === 'object') {
                // Standard format: user is an object
                extractedUserData = user;
            } else {
                // Fallback: create minimal user object
                extractedUserData = {
                    id: userId || response.data.userId || response.data.id || 'unknown',
                    username: username || user || userData.username,
                    role: response.data.role || userData.role || 'PLAYER'
                };
            }
            console.log('AuthContext: Extracted user data:', extractedUserData);

            // Store in localStorage
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('user', JSON.stringify(extractedUserData));

            console.log('AuthContext: Token saved to localStorage:', token ? 'Yes' : 'No');
            console.log('AuthContext: User data saved to localStorage:', extractedUserData);

            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: { user: extractedUserData, token },
            });

            console.log('Register successful:', { user: extractedUserData, token });
            return { success: true, user: extractedUserData };
        } catch (error) {
            console.error('AuthContext: Register error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;

