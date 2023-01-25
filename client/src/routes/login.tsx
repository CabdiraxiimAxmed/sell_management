import React from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../features/user';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

export default function SignInSide() {
  console.log('login');
  const [ cookie, setCookie] = useCookies<string>(['']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let username = data.get('username');
    let password = data.get('password');
    if (!username || !password) {
      toast.warn('buuxi meelaha banaan');
      return;
    }
    axios
      .post('api/user/login', { username, password })
      .then(res => {
        if (res.data == 'not_found') {
          toast.error('xisaabkan ma abuurno!!');
          return;
        } else if (res.data == 'not_match') {
          toast.error('passwordka ma saxna!!');
          return;
        } else if (res.data == 'err') {
          toast.error('qalad ayaa dhacay');
          return;
        }
        dispatch(setUser(res.data));
        setCookie('login', res.data.username, {
           path: '/',
           maxAge: 86400,
        })
        navigate('/products');
      })
      .catch(err => {
        toast.error(err.message);
      });
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Paper style={{ width: '30rem' }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
