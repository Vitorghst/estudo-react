import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Navigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, Button, Typography, TextField, useMediaQuery, Modal, Box } from '@mui/material';
import logo1 from '../../assets/logo1.png';
import { useSnackbar } from 'notistack';
import './Login.css'


function LoginForm({ onLogin }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [permission, setPermission] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const isMd = useMediaQuery('(min-width:600px)');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5110/api/Auth/validate', {
        username: username,
        password: password
      });

      if (response.status === 200) {
        enqueueSnackbar(`Bem-vindo, ${username}!`, { variant: 'success' }); // Adicione esta linha
        const user = await axios.get('http://localhost:5110/api/Auth/getUser', {
          params: {
            username: username
          }
        });
        const timer = setTimeout(() => {
          sessionStorage.setItem('token', username);
          setIsLoggedIn(true);
          onLogin(username);
          const idUser = user.data.id;
          setUserId(idUser);
          const permUser = user.data.permission;
          setPermission(permUser);
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        sessionStorage.removeItem('token');
        alert(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.log(axiosError.response?.data);
        if (axiosError.response?.status === 401) {
          alert(axiosError.response?.data);
        } else {
        }
      }
    }
  };


  if (isLoggedIn) {
    return <Navigate to="/Produtos" state={{ permission, userId }} replace />;
  }


  return (
    <section className="h-100 gradient-form background-login">
      <Container>
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Grid item xs={12} md={8} lg={8}>
            <Card className="rounded-3 text-black">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <CardContent>
                    <div className="text-center">
                      <img src={logo1} style={{ width: '85px' }} alt="logo" />
                      <Typography variant="h4" component="h4" gutterBottom>
                        Nós somos Meat Team
                      </Typography>
                    </div>


                    <form onSubmit={handleSubmit}>
                      <Typography paragraph>
                        Por favor, faça login na sua conta.
                      </Typography>

                      <div>
                        <img src="../../../../assets/images/user-log.png" alt="" className="me-1" width="30" />
                        <TextField
                          id="user"
                          label="User"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      <div className="mb-4">
                        <img src="../../../../assets/images/password.png" alt="" className="me-1" width="27" />
                        <TextField
                          id="password"
                          label="Senha"
                          variant="outlined"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          fullWidth
                        />
                      </div>
                      <div className="mt-3 mb-2">
                        <Button variant="contained" type="submit" fullWidth>Contained</Button>
                      </div>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="d-flex align-items-center justify-content-center pb-4">
                      <Typography variant="body2" component="p" className="mb-0 me-2">
                        Você não possui uma conta?
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                      >
                        Cadastre-se
                      </Button>

                    </div>
                  </CardContent>
                </Grid>
                <Grid item xs={1} sm={12} md={6} className={`d-flex col-sm-1 align-items-center ${isMd ? 'img-md' : 'img-xs'}`}>
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4 ">
                    {/* Aqui vai o conteúdo que você precisa */}
                  </div>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default LoginForm;
