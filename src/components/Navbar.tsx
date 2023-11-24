import { useState } from "react";
import {
  AppBar,
  MenuItem,
  CircularProgress,
  Tooltip,
  Button,
  Avatar,
  Container,
  Menu,
  Typography,
  IconButton,
  Toolbar,
  Box,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { auth } from "../firebase";

interface NavbarProps {
  logInStatus: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  logInStatus,
}: {
  logInStatus: boolean;
}) => {
  const userData = useSelector((state: RootState) => state.navbarData);

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = () => {
    try {
      signOut(auth).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {logInStatus ? (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={() => setAnchorElNav(null)}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <MenuItem onClick={() => setAnchorElNav(null)}>
                    <Typography textAlign="center">New Post</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setAnchorElNav(null)}>
                    <Typography
                      onClick={() => navigate("/editDetail")}
                      textAlign="center"
                    >
                      Edit Details
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  onClick={() => setAnchorElNav(null)}
                  sx={{ my: 2, color: "white", display: "flex" }}
                >
                  <MenuItem onClick={() => setAnchorElNav(null)}>
                    <Typography textAlign="center">New Post</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setAnchorElNav(null)}>
                    <Typography
                      onClick={() => navigate("/editDetail")}
                      textAlign="center"
                    >
                      Edit Details
                    </Typography>
                  </MenuItem>
                </Button>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <div className="flex gap-x-4">
                  <div>
                    <Typography variant="h6" component="h6">
                      {userData.userDetails && userData.userDetails?.firstName}{" "}
                      {userData.userDetails && userData.userDetails.lastName}
                    </Typography>
                    <Typography>
                      {userData.userDetails && userData.userDetails.email}
                    </Typography>
                  </div>
                  {userData.status === "succeeded" && userData.userDetails ? (
                    <Tooltip title="click to Logout">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar
                          alt="Remy Sharp"
                          src={userData.userDetails?.profilePhotoPath}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Skeleton
                      sx={{ bgcolor: "text.secondary" }}
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                >
                  <MenuItem onClick={() => setAnchorElUser(null)}>
                    <Typography textAlign="center" onClick={handleLogout}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      ) : null}
    </>
  );
};
export default Navbar;
