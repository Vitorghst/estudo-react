import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/garfo.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'One Dot Condensed Bold, Arial Narrow, Arial, Helvetica, sans-serif',
  },
});


const pages = [{ name: "Produtos" }, { name: "Pedidos" }];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const NavBar = ({ onToken }: any) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (
    event: React.MouseEvent<HTMLElement>,
    pageName: string
  ) => {
    if(pageName === 'backdropClick') {
      setAnchorElNav(null);
    } else {
      navigate(pageName)
    } 
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const exit = () => {
    sessionStorage.removeItem("token");
    onToken(false);
    navigate("/");
  };

  const handleMenuItemClick = (setting: string) => {
    if (setting === "Logout") {
      exit();
    } else {
      handleCloseUserMenu(); // Para outros itens, apenas feche o menu
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#006491" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={logo}
            height={50}
            alt="Logo"
            style={{ marginRight: "8px" }} // Defina a margem aqui
            sx={{ display: { xs: "none", md: "none" } }} // Controle a exibição com sx
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "none" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          ></Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
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
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "block" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={(event) => handleCloseNavMenu(event, page.name)}
                >
                  <Typography className="typo" sx={{ textAlign: "center"}}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/Produtos"
            className="typo"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "flex" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <div className="row">
              <div className="col-md-3 ms-5">
              <img src={logo} height="50" className="me-3"  alt="" />
              </div>
              <div className="col-sm-2 col-md-6 mt-2">
              GARFO
              </div>
            </div>
            
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "none" } }}>
            {pages.map((page) => (
             <Button
             key={page.name}
             onClick={(event) => handleCloseNavMenu(event, page.name)}
             sx={{ my: 2, color: "white", display: "block", fontFamily: "One Dot Condensed Bold, Arial Narrow, Arial, Helvetica, sans-serif", fontSize:"16px" }}
           >
             <span className="typo">{page.name}</span>
           </Button>
              
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
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
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleMenuItemClick(setting)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
