import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Navbar(){
  return(
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{flex:1}}>
          Smart Attendance
        </Typography>

        <Button color="inherit" href="/scan">
          Scan
        </Button>

        <Button color="inherit" href="/admin">
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}
