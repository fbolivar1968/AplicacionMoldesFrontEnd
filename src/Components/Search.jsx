import * as React from 'react';
import '../styles/globals.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';


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

export default function Search() {
    return (
        <ThemeProvider theme={theme}>
            <div className="flex-row inline-flex items-center ml-0 m-5">
                <MenuIcon fontSize="large" color="blueFB"/>
                <input className="rounded-r-none font-semibold<"  type="text" placeholder="Buscar"/>
                <button className="bg-white h-10.5 border-l-gray-500 rounded-r-sm "><SearchIcon color={"blueFB"}/></button>
            </div>
        </ThemeProvider>

    );
}
