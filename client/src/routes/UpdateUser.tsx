import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Box, Button, Typography } from '@mui/material';
import { UserType } from './UserManagement';
import { useParams } from 'react-router-dom';
import axios from 'axios';

let permission_pages: string[] = [
  "user-management",
  "supplier",
  "products",
  "add-product",
  "product",
  "product-alert",
  "customer",
  "customer-info",
  "supplier-info",
  "purchase-order",
  "purchase-edit",
  "purchase-paper",
  "sale-paper",
  "edit-sale",
  "order",
  "sales",
  "sale",
  "add-user",
  "add-supplier",
  "update-user",
]

const UpdateUser: React.FC = () => {
  console.log('update user');
  const navigate = useNavigate();
  const [userPermissions, setUserPermissions] = useState<{
    [key: string]: boolean;
  }>({});

  const [user, setUser] = useState<UserType>({
    id: 0,
    name: '',
    username: '',
    role: '',
    password: '',
    created_date: '',
    permissions: [[{ test: false }]],
    contact: '',
  });
  const { username } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:2312/user/${username}`)
      .then(res => {
        if(res.data.permissions) {
          for (let permission of res.data.permissions[0]) {
            setUserPermissions(prevState => {
              return { ...prevState, ...permission }
            });
          }
        }
        setUser(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, []);

  const deleteUser = () => {
    axios
      .post(`http://localhost:2312/user/delete/${user.username}`, {})
      .then(res => {
        if (res.data === 'success') {
          toast.success('waa lagu guuleystay');
          setTimeout(() => {
            navigate('/user-management');
          }, 2000);
        }
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let permissions: {[key: string]: boolean}[] = [];
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let username = data.get('username');
    let role = data.get('role');
    let password = data.get('password');
    let contact = data.get('contact');
    for(let page of permission_pages) {
      let make_it_object: {[key: string]: boolean} = {};
      if(data.get(page) === 'on'){
        make_it_object[page] = true;
        permissions.push(make_it_object);
      } else {
        make_it_object[page] = false;
        permissions.push(make_it_object);
      } 
    }
    if (!name || !username || !password || !contact || !role) {
      toast.warn('fadlan buuxi');
      return;
    }
    if (!name || !username || !password || !contact || !role) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios
      .post('http://localhost:2312/user/update-user', {
        id: user.id,
        name,
        username,
        role,
        contact,
        password,
        permissions,
      })
      .then(res => {
        if (res.data === 'error') {
          toast.error('qalada ayaa dhacay');
        }
        if (res.data === 'success') {
          toast.success('waa lagu guuleystay');
          setTimeout(() => {
            navigate('/user-management');
          }, 2000);
        }
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  const isChecked = (name: string) => {
    return userPermissions[name];
  };

  const handleChange = (name: string) => {
    setUserPermissions({
      ...userPermissions,
      [name]: !userPermissions[name],
    });
  };

  return (
    <div className="add-user-container">
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
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}
      >
        <TextField
          required
          id="name"
          multiline
          defaultValue={user.name}
          helperText="Magaca"
          name="name"
        />
        <TextField
          required
          id="outlined-password-input"
          multiline
          defaultValue={user.username}
          helperText="username"
          name="username"
        />
        <TextField
          required
          name="contact"
          multiline
          defaultValue={user.contact}
          id="outlined-password-input"
          helperText="contact"
          type="name"
        />
        <TextField
          required
          name="role"
          multiline
          defaultValue={user.role}
          id="outlined-password-input"
          helperText="role"
          type="nameuserPermissions['user-management']"
        />
        <TextField
          required
          name="password"
          multiline
          defaultValue={user.password}
          id="outlined-password-input"
          helperText="password"
          type="password"
        />
        <div></div>
        <div className="role-permissions">
          <Typography variant="h5">Permissions</Typography>
          <div className='inner-container'>
            {permission_pages.map((permission: string, index: number) => (
              <div key={index} className="permissions-button">
                <label className="switch">
                  <input
                    type="checkbox"
                    name={permission}
                    checked={isChecked(permission)}
                    onChange={() => handleChange(permission)}
                  />
                  <span>{permission} page</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div></div>
        <Button type="submit" fullWidth variant="contained">
          Submit
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={deleteUser}
        >
          Delete
        </Button>
      </Box>
    </div>
  );
};

export default UpdateUser;
