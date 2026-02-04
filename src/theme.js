import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4361EE', // Vibrant Blue
            light: '#4895EF',
            dark: '#3F37C9',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#F72585', // Vibrant Pink/Magenta
            light: '#FF63A5',
            dark: '#B5179E',
        },
        success: {
            main: '#06D6A0', // Vibrant Mint Green
            contrastText: '#fff',
        },
        warning: {
            main: '#FF9F1C', // Vibrant Orange
            contrastText: '#fff',
        },
        background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#2B2D42',
            secondary: '#8D99AE',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Outfit", "Inter", sans-serif',
        h1: { fontFamily: 'Outfit, sans-serif', fontWeight: 800 },
        h2: { fontFamily: 'Outfit, sans-serif', fontWeight: 700 },
        h4: { fontFamily: 'Outfit, sans-serif', fontWeight: 700 },
        h5: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
        h6: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.04)',
                },
                elevation3: {
                    boxShadow: '0px 15px 35px rgba(67, 97, 238, 0.15)', // Blue-ish shadow
                },
                rounded: {
                    borderRadius: 24,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.3s ease',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    height: 10,
                },
            },
        },
    },
});

export default theme;
