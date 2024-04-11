// NO LONGER SUPPORTED, MAIN THEME DECLARED IN APP.JSX AS A CONSTANT THEME

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B2D06', // colours here
    },
    secondary: {
        main: '#954331', // secondary colours if we need any
    },
    background: {
        default: '#CCC4C2', // background colour of the site pages
        paper: '#FFFFFF', // background colour for paper/forms/etc
    },
    // colour overrides can go here, not sure if we'll need any
  },
  // typography themes here anyone? overrides?
});

export default theme;