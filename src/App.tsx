import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Produtos from './components/Produtos/Produtos';
import Login from './components/Login/Login';
import store from '../src/components/Store/Store';
import { Provider } from 'react-redux';
import Navbar from './components/NavBar/Navbar';

interface AuthCheckerProps {
  children: ReactNode;
}

function AuthChecker({ children }: AuthCheckerProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Verificar se há um token no sessionStorage ao carregar o componente
    const token = sessionStorage.getItem('token');
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
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false)
    }
  }, []);

  const handleLogin = (token: string) => {
    // Armazenar o token no sessionStorage ao fazer login
    sessionStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleRemove = (remove: boolean) => {
    setIsLoggedIn(remove)
  }

  return (
    <Router>
      <div className="App">
        {(isLoggedIn && sessionStorage.getItem('token')) && <Navbar onToken={handleRemove} />}
        <Provider store={store}>
          <div className="content overflow">
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/Produtos"
                element={isLoggedIn || sessionStorage.getItem('token') ? <Produtos /> : <Navigate to="/" replace />}
              />
            </Routes>
          </div>
        </Provider>
      </div>
    </Router>
  );
}

export default App;
