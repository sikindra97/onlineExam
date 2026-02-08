import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Stack,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email"; // ✅ ADDED

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeContext";

/* ✅ LOGO IMAGE IMPORT */
import logo from "../assets/TESTCRAFT.jpeg";

export default function Header() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goTo = (filter, view) => {
    let query = "";
    if (filter) query += `?filter=${filter}`;
    if (view) query += query ? `&view=${view}` : `?view=${view}`;
    navigate(`/${query}`);
    setOpen(false);
  };

  const menuItems = [
    { label: "Dashboard", action: () => goTo() },
    { label: "Active Exams", action: () => goTo("ACTIVE") },
    { label: "Upcoming Exams", action: () => goTo("UPCOMING") },
    { label: "Live Exams", action: () => goTo("LIVE") },
    { label: "Exam History", action: () => goTo(null, "history") },
    { label: "Contact Support", action: () => navigate("/contact") }, // ✅ ADDED
    user.role === "admin" && {
      label: "Manage Users",
      action: () => navigate("/admin/users"),
    },
    { label: "Logout", action: handleLogout },
  ].filter(Boolean);

  return (
    <>
      {/* ================= APP BAR ================= */}
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: "space-between" }}>

          {/* LEFT - Logo and Menu */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              color="inherit"
              sx={{ display: { md: "none" } }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>

          <Box
  display="flex"
  alignItems="center"
  gap={1}
  sx={{ cursor: "pointer" }}
  onClick={() => goTo()}
>
  <Avatar
    src={logo}
    alt="TestCraft"
    sx={{ width: 40, height: 40, bgcolor: "transparent" }}
  />

  {/* BRAND TEXT */}
  <Box sx={{ display: { xs: "none", sm: "block" } }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        lineHeight: 1,
      }}
    >
      TestCraft
    </Typography>

    <Typography
      variant="caption"
      sx={{
        opacity: 0.8,
        fontSize: "0.72rem",
        letterSpacing: "0.05em",
      }}
    >
      Online Examination System
    </Typography>
  </Box>
</Box>

          </Box>

          {/* CENTER MENU */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button color="inherit" onClick={() => goTo()}>Dashboard</Button>
            <Button color="inherit" onClick={() => goTo("ACTIVE")}>Active</Button>
            <Button color="inherit" onClick={() => goTo("UPCOMING")}>Upcoming</Button>
            <Button color="inherit" onClick={() => goTo("LIVE")}>Live</Button>
            <Button color="inherit" onClick={() => goTo(null, "history")}>History</Button>
          </Stack>

          {/* RIGHT (DESKTOP) */}
          <Box display={{ xs: "none", md: "flex" }} alignItems="center" gap={2}>
           <Chip
  label={user.role.toUpperCase()}
  size="small"
  sx={{
    bgcolor: "#ffffff",
    color: "#1976d2",
    fontWeight: 600,
    borderRadius: 2,
    px: 1.2,
    height: 32,
  }}
/>


            {/* ✅ CONTACT SUPPORT BUTTON */}
            <Button
  variant="contained"
  startIcon={<EmailIcon />}
  onClick={() => navigate("/contact")}
  sx={{
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "#ffffff",
    color: "#1976d2",
    borderRadius: 2,
    boxShadow: "none",
    "&:hover": {
      bgcolor: "#f0f4ff",
      boxShadow: "none",
    },
  }}
>
  Contact Support
</Button>


            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Typography variant="body2">{user.name}</Typography>

            <Button
  variant="contained"
  startIcon={<LogoutIcon />}
  onClick={handleLogout}
  size="small"
  sx={{
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "#ffffff",
    color: "#1976d2",
    borderRadius: 2,
    boxShadow: "none",
    "&:hover": {
      bgcolor: "#f0f4ff",
      boxShadow: "none",
    },
  }}
>
  Logout
</Button>

          </Box>

          {/* MOBILE RIGHT */}
          <Box display={{ xs: "flex", md: "none" }} alignItems="center" gap={1}>
            <Tooltip title="Contact Support">
              <IconButton color="inherit" onClick={() => navigate("/contact")}>
                <EmailIcon />
              </IconButton>
            </Tooltip>

            <IconButton color="inherit" onClick={toggleTheme} size="small">
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <IconButton color="inherit" onClick={handleLogout} size="small">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= DRAWER ================= */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar src={logo} alt="TestCraft" sx={{ width: 45, height: 45 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                TestCraft
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Online Examination System
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box mb={2} p={1} bgcolor="rgba(25,118,210,0.1)" borderRadius={1}>
            <Typography variant="body2" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role.toUpperCase()}
            </Typography>
          </Box>

          <List>
            {menuItems.map((item, i) => (
              <ListItem
                button
                key={i}
                onClick={item.action}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            <ListItem button onClick={toggleTheme} sx={{ borderRadius: 1, mt: 1 }}>
              <ListItemText
                primary={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
