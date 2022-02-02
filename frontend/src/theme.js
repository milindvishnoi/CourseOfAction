import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00A1DF",
    },
    secondary: {
      main: "#0256C4",
    },
    green: {
      main: "#118A7E",
    },
    background: {
      paper: "#1B1B22",
    },
    popup: {
      main: "#2E2E33",
    },
    text: {
      primary: "#ffffff",
      secondary: "#00A1DF",
    },
    navBackgorund: {
      main: "#484848",
    },
    green: {
      main: "#118A7E",
    },
    highlight: {
      main: "#2E2E33",
    },
  },
  typography: {
    h1: {
      fontSize: 72,
      fontWeight: 900,
    },
  },
});

export default theme;
