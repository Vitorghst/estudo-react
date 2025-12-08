import { ReactNode, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Produtos from "./components/Produtos/Produtos";
import Login from "./components/Login/Login";
import store from "../src/components/Store/Store";
import { Provider } from "react-redux";
import Navbar from "./components/NavBar/Navbar";
import { SnackbarProvider } from "notistack";
import Pedidos from "./components/Pedidos/Pedidos";
import logo from "./assets/garfo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBuilding,
  faPhone,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";
import pizza from "./assets/pizza-svg.png";
import bld from "./assets/bld.png";
import phone from "./assets/phone-fot.png";
import { motion } from "framer-motion";

interface AuthCheckerProps {
  children: ReactNode;
}

function AuthChecker({ children }: AuthCheckerProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se há um token no sessionStorage ao carregar o componente
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se há um token no sessionStorage ao carregar o componente
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const images = [
    "https://s1.1zoom.me/b6152/819/Pizza_Tomatoes_547600_1920x1080.jpg",
    "https://files.menudino.com/cardapios/8669/capa.jpg",
    "https://images4.alphacoders.com/276/thumb-1920-276908.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 11000); // Troca de imagem a cada 3 segundos
    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogin = (token: string) => {
    // Armazenar o token no sessionStorage ao fazer login
    sessionStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const handleRemove = (remove: boolean) => {
    setIsLoggedIn(remove);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <div className="App">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        </Routes>
          {isLoggedIn && sessionStorage.getItem("token") && (
            <Navbar onToken={handleRemove} />
          )}

          <Provider store={store}>
            {isLoggedIn && sessionStorage.getItem("token") && (
              <div style={{ position: "relative", width: "100%" }}>
                {images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      width: "100%",
                      height: "100%",
                      left: 0,
                      objectFit: "cover",
                      zIndex: -1, // Garante que as imagens fiquem no fundo
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentIndex === index ? 1 : 0 }}
                    transition={{ duration: 1 }} // Transição suave
                  />
                ))}
                <div className="content margin-bottom-footer">
                  <Routes>
                    <Route
                      path="/Produtos"
                      element={
                        isLoggedIn || sessionStorage.getItem("token") ? (
                          <Produtos />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                    <Route
                      path="/Pedidos"
                      element={
                        isLoggedIn || sessionStorage.getItem("token") ? (
                          <Pedidos />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                  </Routes>
                </div>
              </div>
            )}
          </Provider>
          {isLoggedIn && sessionStorage.getItem("token") && (
            <footer className="main_footer container-foot">
              <div className="content">
                <div className="row">
                  <div className="col-md-4">
                    <img src={logo} className="mt-3" alt="" width="50" />
                  </div>
                  <div
                    className="col-md-8 right mt-4"
                    style={{ fontSize: "16px" }}
                  >
                    <span className="me-3">
                      <img src={pizza} height={30} className="me-1"></img>Página
                      Inicial
                    </span>
                    <span className="me-3">
                      <img src={bld} height={30} className="me-1"></img>Sobre a
                      Empresa
                    </span>
                    <span className="me-3">
                      <img src={phone} height={25} className="me-2"></img>Fale
                      Conosco
                    </span>
                  </div>
                </div>

                <hr></hr>
                <div className="row">
                  <div
                    className="left col-md-4 mt-1"
                    style={{ fontSize: "16px" }}
                  >
                    @ 2024 Garfo. All rights reserved
                  </div>
                  <div className="right col-md-8">
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="me-3"
                      size="2xl"
                      style={{ color: "#ffffff" }}
                    />
                    <FontAwesomeIcon
                      icon={faXTwitter}
                      className="me-3"
                      size="2xl"
                      style={{ color: "#ffffff" }}
                    />
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="me-3"
                      size="2xl"
                      style={{ color: "#ffffff" }}
                    />
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="me-3"
                      size="2xl"
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
