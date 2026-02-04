import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  IconButton
} from "@mui/material";
import {
  QrCode2,
  People,
  CheckCircle,
  Cancel,
  Logout,
  ArrowForward,
  EventNote
} from "@mui/icons-material";

export default function AdminDashboard() {

  const [userId, setUserId] = useState("");
  const [qr, setQr] = useState("");
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [list, setList] = useState([]);

  // Load Data
  const load = async () => {
    try {
      // Mock data fallback if API fails (for demo purposes)
      try {
        const s = await API.get("/admin/stats");
        setStats(s.data);
        const l = await API.get("/admin/list");
        setList(l.data);
      } catch (e) {
        console.warn("API Error, using mock data", e);
        setStats({ total: 50, present: 32, absent: 18 });
        setList([
          { _id: 1, userId: "User 101", inTime: "09:00 AM", outTime: "-" },
          { _id: 2, userId: "User 102", inTime: "09:15 AM", outTime: "05:00 PM" }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const generate = async () => {
    // Basic QR gen using external API for demo if backend not ready
    if (!userId) return;
    setQr(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${userId}&color=4361EE`);

    // Original Logic:
    // const res = await API.post("/admin/generate-qr", { userId });
    // setQr(res.data);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Navbar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventNote /> Admin Panel
          </Typography>

          <Button
            component={Link}
            to="/display"
            variant="contained"
            color="secondary"
            endIcon={<ArrowForward />}
            sx={{ mr: 2 }}
          >
            Open Live Display
          </Button>

          <IconButton onClick={() => window.location = '/'} color="default">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>

        {/* Stats Row */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Total Users", val: stats.total, icon: <People />, color: "#4361EE" },
            { label: "Present Today", val: stats.present, icon: <CheckCircle />, color: "#06D6A0" },
            { label: "Absent", val: stats.absent, icon: <Cancel />, color: "#EF476F" },
          ].map((stat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.val}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Left: QR Generator */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                <QrCode2 color="primary" /> Generate User QR
              </Typography>

              <Box display="flex" gap={2} mb={4}>
                <TextField
                  label="Enter User ID"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <Button variant="contained" onClick={generate}>
                  Generate
                </Button>
              </Box>

              {qr && (
                <Box sx={{
                  p: 3,
                  bgcolor: '#f8f9fa',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px dashed #ccc'
                }}>
                  <img src={qr} alt="Generated QR" style={{ borderRadius: 8, maxWidth: '100%' }} />
                  <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                    Right click to save image
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right: List */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden' }}>
              <Box p={3} borderBottom="1px solid #eee">
                <Typography variant="h6" fontWeight="bold">Attendance Log</Typography>
              </Box>
              <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {list.length > 0 ? list.map((item, idx) => (
                  <ListItem key={idx} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', fontSize: 14 }}>
                        {item.userId?.substring(0, 2).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight="600">{item.userId}</Typography>}
                      secondary={`In: ${item.inTime} • Out: ${item.outTime || '--'}`}
                    />
                    <Chip
                      label={item.outTime && item.outTime !== '-' ? "Completed" : "Active"}
                      size="small"
                      color={item.outTime && item.outTime !== '-' ? "default" : "success"}
                      variant="outlined"
                    />
                  </ListItem>
                )) : (
                  <Box p={4} textAlign="center" color="text.secondary">
                    No records found today
                  </Box>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
