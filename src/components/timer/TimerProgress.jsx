"use client";
import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

function TimerProgress({progress, setProgress}) {

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = 100 / 200; // 200 seconds
                return Math.min(oldProgress + diff, 100);
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return <div className='mt-3'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress 
                    variant="determinate"
                    value={progress}
                />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    progress,
                )} sn`}</Typography>
            </Box>
        </Box>

    </div>;
}

export default TimerProgress;