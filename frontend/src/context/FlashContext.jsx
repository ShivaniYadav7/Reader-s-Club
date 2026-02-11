import React, { createContext, useContext, useState, useCallback} from 'react';
import { Snackbar, Alert } from '@mui/material';

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const flash = useCallback((msg, type = 'success') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    }, []);

    const handleClose = (event, reason) => {
        if(reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <FlashContext.Provider value={flash}>
            {children}
            <Snackbar 
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
            >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', boxShadow: 3}}>
                {message}
            </Alert>
            </Snackbar>

        </FlashContext.Provider>
    );
};

export const useFlash = () => useContext(FlashContext);