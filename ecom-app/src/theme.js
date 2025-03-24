import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E3A8A" }, // Deep Blue (Avoids ChatGPT blue)
    secondary: { main: "#F59E0B" }, // Warm Amber
    background: { default: "#F9FAFB", paper: "#FFFFFF" },
    text: { primary: "#1E293B", secondary: "#64748B" },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { backgroundColor: "#1E3A8A" } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#0F172A" }, // Dark Navy
    secondary: { main: "#EAB308" }, // Golden Yellow
    background: { default: "#0A0F1E", paper: "#111827" },
    text: { primary: "#E5E7EB", secondary: "#9CA3AF" },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { backgroundColor: "#0F172A" } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});
