import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../services/api";
import { Box, Typography, Paper, Alert, Container, CircularProgress } from "@mui/material";
import { QrCodeScanner } from "@mui/icons-material";

export default function ScanPage() {

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Config specifically tuned for mobile
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false
    };

    const scanner = new Html5QrcodeScanner("reader", config, false);

    scanner.render(async (text) => {
      // Pause scanning
      scanner.pause();
      setLoading(true);

      try {
        // Assume text is user ID or JSON string
        let userId = text;
        try {
          const data = JSON.parse(text);
          userId = data.userId || userId;
        } catch (e) { }

        const res = await api.post("/attendance/scan", { userId });
        setMsg(res.data?.message || "Scan Successful!");

      } catch (err) {
        setMsg("Scan Failed or Invalid QR");
      } finally {
        setLoading(false);
        // Wait 2s before scanning again to avoid double scans
        setTimeout(() => {
          setMsg("");
          scanner.resume();
        }, 3000);
      }
    }, (error) => {
      // console.warn(error); 
    });

    return () => {
      try { scanner.clear(); } catch (e) { }
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Box textAlign="center" mb={4}>
          <QrCodeScanner sx={{ fontSize: 40, color: '#4361EE', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">Scan Attendance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>Align QR code within the frame</Typography>
        </Box>

        <Paper
          elevation={10}
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: '#1a1a1a',
            overflow: 'hidden',
            border: '1px solid #333'
          }}
        >
          <div id="reader" style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}></div>
        </Paper>

        <Box mt={4} minHeight={60}>
          {loading ? (
            <CircularProgress color="primary" />
          ) : (
            msg && (
              <Alert
                severity={msg.includes("Fail") || msg.includes("Invalid") ? "error" : "success"}
                variant="filled"
                sx={{ borderRadius: 3, fontWeight: 'bold' }}
              >
                {msg}
              </Alert>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}
