import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip,
    LinearProgress,
    Button,
    IconButton,
    Card,
    CardContent,
    // useTheme
} from '@mui/material';
import {
    CheckCircleRounded,
    CancelRounded,
    QrCodeScanner,
    AccessTimeFilled,
    PersonOutline,
    RefreshRounded
} from '@mui/icons-material';

const socket = io("http://localhost:5000");

export default function SmartAttendanceWithQR() {
    // const theme = useTheme();
    const [timeLeft, setTimeLeft] = useState(60);
    const [qrData, setQrData] = useState("init-qr-code");
    // Mock data 
    const [logs, setLogs] = useState([
        { id: 1, name: "Shivang", status: "Present", time: "10:00 AM", role: "Dev" },
        { id: 2, name: "Rahul", status: "Out", time: "10:05 AM", role: "Designer" },
    ]);

    // Timer & QR Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setQrData(`qr-${Date.now()}`);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Socket Logic
    useEffect(() => {
        socket.on("attendance_update", (data) => {
            setLogs((prev) => [data, ...prev]);
        });
        return () => socket.off("attendance_update");
    }, []);

    const presentCount = logs.filter(l => l.status === 'Present').length;
    const outCount = logs.filter(l => l.status === 'Out').length;

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f0f2f5',
            background: 'linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%)',
            pb: 4,
            fontFamily: 'Poppins, sans-serif'
        }}>

            {/* Navbar */}
            <Box sx={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)' }}>
                                <QrCodeScanner />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" color="text.primary" sx={{ lineHeight: 1 }}>AttendaQR</Typography>
                                <Typography variant="caption" color="text.secondary">Real-time Tracking System</Typography>
                            </Box>
                        </Box>
                        <Chip
                            icon={<AccessTimeFilled sx={{ fontSize: '1rem !important' }} />}
                            label="Live Session Active"
                            color="success"
                            variant="outlined"
                            sx={{ bgcolor: 'success.light', color: 'success.dark', border: 'none', fontWeight: 700 }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={4}>

                    {/* LEFT: QR CARD */}
                    <Grid item xs={12} lg={7}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 0,
                                height: '650px',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                background: 'white',
                            }}
                        >
                            {/* Animated Background Mesh */}
                            <Box sx={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(67,97,238,0.05) 0%, rgba(255,255,255,0) 70%)',
                                animation: 'spin 60s linear infinite',
                                zIndex: 0
                            }} />
                            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

                            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
                                <Typography variant="h3" sx={{ mb: 1, color: 'text.primary' }}>Scan to Check-In</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                                    Launch the app and point your camera at the code
                                </Typography>

                                {/* QR Container */}
                                <Box sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    p: 4,
                                    borderRadius: 8,
                                    bgcolor: 'white',
                                    boxShadow: '0 20px 60px -10px rgba(67, 97, 238, 0.2)',
                                    border: '1px solid rgba(67, 97, 238, 0.1)'
                                }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${qrData}&color=4361EE&bgcolor=ffffff`}
                                        alt="QR"
                                        style={{ width: 280, height: 280, display: 'block' }}
                                    />

                                    {/* Corner Accents */}
                                    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                                        <Box key={pos} sx={{
                                            position: 'absolute',
                                            width: 20, height: 20,
                                            borderColor: 'primary.main',
                                            borderStyle: 'solid',
                                            borderWidth: pos.includes('top') ? '4px 0 0 0' : '0 0 4px 0',
                                            [pos.split('-')[0]]: 0,
                                            [pos.split('-')[1]]: 0,
                                            borderLeftWidth: pos.includes('left') ? '4px' : '0',
                                            borderRightWidth: pos.includes('right') ? '4px' : '0',
                                            borderRadius: 1
                                        }} />
                                    ))}
                                </Box>

                                {/* Timer */}
                                <Box sx={{ width: 300, mx: 'auto', mt: 6 }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">REFRESHING IN</Typography>
                                        <Typography variant="caption" fontWeight="bold" color="primary.main">{timeLeft}s</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(timeLeft / 60) * 100}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'grey.100',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                background: timeLeft < 10 ? '#ef476f' : 'linear-gradient(90deg, #4361EE 0%, #4CC9F0 100%)'
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* RIGHT: DASHBOARD */}
                    <Grid item xs={12} lg={5}>
                        <Box display="flex" gap={2} mb={3}>
                            <Card sx={{ flex: 1, bgcolor: 'primary.main', color: 'white', position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.2 }}>
                                    <CheckCircleRounded sx={{ fontSize: 100 }} />
                                </Box>
                                <CardContent>
                                    <Typography variant="h3" fontWeight={800}>{presentCount}</Typography>
                                    <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Present</Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ flex: 1, bgcolor: 'white', color: 'text.primary', position: 'relative', border: '1px solid #eee' }}>
                                <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.05 }}>
                                    <CancelRounded sx={{ fontSize: 100, color: 'black' }} />
                                </Box>
                                <CardContent>
                                    <Typography variant="h3" fontWeight={800} color="secondary.main">{outCount}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Checked Out</Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                height: '520px',
                                bgcolor: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <Box p={3} borderBottom="1px solid #f5f5f5" display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">Recent Activity</Typography>
                                <IconButton size="small"><RefreshRounded /></IconButton>
                            </Box>

                            <List sx={{ flex: 1, overflowY: 'auto', px: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {logs.map((log, idx) => (
                                    <ListItem
                                        key={idx}
                                        sx={{
                                            bgcolor: 'background.default',
                                            borderRadius: 3,
                                            mb: 1,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                bgcolor: 'white',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: log.status === 'Present' ? 'success.light' : 'secondary.light',
                                                    color: log.status === 'Present' ? 'success.dark' : 'secondary.dark',
                                                    fontWeight: 800
                                                }}
                                            >
                                                {log.name.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography fontWeight={600}>{log.name}</Typography>}
                                            secondary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.3 }}>•</Typography>
                                                    <Typography variant="caption" color="text.secondary">{log.role || "Member"}</Typography>
                                                </Box>
                                            }
                                        />
                                        <Chip
                                            label={log.status === 'Present' ? "IN" : "OUT"}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                bgcolor: log.status === 'Present' ? 'rgba(6, 214, 160, 0.1)' : 'rgba(247, 37, 133, 0.1)',
                                                color: log.status === 'Present' ? 'success.main' : 'secondary.main',
                                                borderRadius: 2
                                            }}
                                        />
                                    </ListItem>
                                ))}

                                {logs.length === 0 && (
                                    <Box height="100%" display="flex" flexDirection="column" alignItems="center" justify="center" p={4} sx={{ opacity: 0.5 }}>
                                        <PersonOutline sx={{ fontSize: 60, mb: 2 }} />
                                        <Typography>No active scans yet</Typography>
                                    </Box>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Floating Simulator */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        borderRadius: 50,
                        width: 60,
                        height: 60,
                        minWidth: 0,
                        boxShadow: '0 10px 25px rgba(67, 97, 238, 0.4)'
                    }}
                    onClick={() => {
                        const names = ["Alice", "Bob", "Charlie", "Diana", "Ethan"];
                        const roles = ["Developer", "Designer", "Manager", "Intern"];
                        const randomName = names[Math.floor(Math.random() * names.length)];
                        setLogs(prev => [{
                            id: Date.now(),
                            name: randomName,
                            status: Math.random() > 0.5 ? "Present" : "Out",
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            role: roles[Math.floor(Math.random() * roles.length)]
                        }, ...prev]);
                    }}
                >
                    <QrCodeScanner />
                </Button>
            </Container>
        </Box>
    );
}
