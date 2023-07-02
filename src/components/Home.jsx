import { Box, Typography } from '@mui/material';
import React from 'react';
const Home = () => {
    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '80vh' }}>
                <Typography variant="h6" component="div">
                    Welcome to UserHub
                </Typography>
            </Box>
        </>
    );
};

export default Home;
