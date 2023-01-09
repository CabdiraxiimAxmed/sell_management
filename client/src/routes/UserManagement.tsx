import React, { useEffect, useState, useRef } from 'react';
import Header, { DrawerHeader } from './Header';
import { useNavigate } from 'react-router-dom';
import {useReactToPrint}  from 'react-to-print';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Box, Stack, Typography, Button } from '@mui/material';

type UserType = {
  id: number,
  name: string,
  username: string,
  role: string,
  password: string,
  created_date: string,
  permissions: string[],
  contact: '';
};
type ColumnDisplayType = {
  id: boolean,
  name: boolean,
  username: boolean,
  role: boolean,
  password: boolean,
  created_date: boolean,
  permissions: boolean,
  contact: boolean
};
const UserManagement: React.FC = () => {
  const componentRef = useRef(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([
    {
      id: 0,
      name: '',
      username: '',
      role: '',
      password: '',
      created_date: '',
      permissions: [''],
      contact: '',
    }
  ]);
  const [usersStore, setUsersStore] = useState<UserType[]>([
    {
      id: 0,
      name: '',
      username: '',
      role: '',
      password: '',
      created_date: '',
      permissions: [''],
      contact: '',
    }
  ]);
  const [columnDisplay, setColumnDisplay] = useState<ColumnDisplayType>({
    id: false,
    name: true,
    username: true,
    role: true,
    password: false,
    created_date: false,
    permissions: false,
    contact: true,
  });
  useEffect(() => {
    axios.get('/user')
         .then(res => {
           setUsers(res.data);
           setUsersStore(res.data);
         })
         .catch(err => {
           console.log(err);
         })
  }, [])

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => { // change function name
    setColumnDisplay({
      ...columnDisplay,
      [e.target.name]: e.target.checked
    });
  };

  const updateUser = (username: string) => {
    navigate(`/update-user/${username}`)
  };

  const filterUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = usersStore.filter((user: UserType) => {
      console.log(user.name, term);
      return user.name.toLowerCase().includes(term.toLowerCase());
    })
    if (!filtered.length) {
      setUsers([
        {
          id: 0,
          name: '',
          username: '',
          role: '',
          password: '',
          created_date: '',
          permissions: [''],
          contact: '',
        }
      ])
      return;
    }
    setUsers(filtered);
  };

  const display = (column_head: string) => {
    return columnDisplay[column_head as keyof ColumnDisplayType];
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginBottom : 9}}>
          <Typography variant="h5" gutterBottom>
            User
          </Typography>
          <Button variant="contained" onClick={() => navigate('/add-user')} startIcon={<AddIcon />} style={{backgroundColor:"#2367d1", fontWeight: 'bold'}}>
            cinwaan
          </Button>
        </Stack>
  <div className="container">
      <div className="search-filters-container">
        <input placeholder="search" className="search" onChange={filterUser}/>
        <div className="filters-container">
          <div className="dropdown">
            <button className="dropBtn"><ViewWeekIcon/> columns</button>
            <div className="dropdown-content">
              {Object.keys(users[0]).map((column_head: string, index: number) => (
                <label className="switch">
                  <input
                    type="checkbox"
                    name={column_head}
                    className="checkbox"
                    onChange={handleClick}
                  checked={columnDisplay[column_head as keyof ColumnDisplayType]}
                  />
                  <span>{column_head}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="dropBtn" onClick={handlePrint}><DownloadIcon/> export</button>
        </div>
      </div>
      <div className="table-container" ref={componentRef}>
        <table>
          <thead>
            <tr>
              {Object.keys(users[0]).map((column_head, index) => (
                <th className={display(column_head)? '': 'inactive'}>{column_head}</th>
              ))}
            </tr>
          </thead>

          {users.map((user, index) => (
            <tbody>
              <tr onClick={() => updateUser(user.username) }>
                <td className={display('id')? '': 'inactive'}>{user.id}</td>
                <td className="user-name">{user.name}</td>
                <td className={display('role')? '': 'inactive'}>{user.role}</td>
                <td className={display('password')? '': 'inactive'}>{user.password}</td>
                <td className={display('created_date')? '': 'inactive'}>{user.created_date}</td>
                <td className={display('username')? '': 'inactive'}>{user.username}</td>
                <td className={display('permissions')? '': 'inactive'}>{user.permissions}</td>
                <td className={display('contact')? '': 'inactive'}>{user.contact}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>

    </>
  );
};
export type {UserType}
export default UserManagement;
