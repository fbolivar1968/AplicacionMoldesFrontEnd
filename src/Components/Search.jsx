import * as React from 'react';
import '../styles/globals.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';



let theme = createTheme({
    // Theme customization goes here as usual, including tonalOffset and/or
    // contrastThreshold as the augmentColor() function relies on these
});
theme = createTheme(theme, {
    // Custom colors created with augmentColor go here
    palette: {
        blueFB: theme.palette.augmentColor({
            color: {
                main: '#003064',
            },
            name: 'blueFB',
        }),
    },
});

export default function Search({ globalFilter, setGlobalFilter }) {
    return (
        <ThemeProvider theme={theme}>
            <div className="flex-row inline-flex items-center mb-5 mt-5">
                <input
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Busca por palabra clave"
                    className=" border-light-greyFB bg-white rounded-sm border-2 w-auto">
                </input>
            </div>
        </ThemeProvider>

    );
}
