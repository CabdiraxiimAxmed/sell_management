import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Stack, Typography, Button } from '@mui/material';

type SupplierType = {
  id: number;
  name: string;
  contact: string;
  address: string;
  created_date: string;
  email: string;
  city: string;
};
type ColumnDisplayType = {
  id: boolean;
  name: boolean;
  contact: boolean;
  address: boolean;
  created_date: boolean;
  email: boolean;
  city: boolean;
};
const Supplier: React.FC = () => {
  console.log('supplier');
  const componentRef = useRef(null);
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierType[]>([
    {
      id: 0,
      name: '',
      contact: '',
      address: '',
      created_date: '',
      email: '',
      city: '',
    },
  ]);
  const [suppliersStore, setSuppliersStore] = useState<SupplierType[]>([
    {
      id: 0,
      name: '',
      contact: '',
      address: '',
      created_date: '',
      email: '',
      city: '',
    },
  ]);
  const [columnDisplay, setColumnDisplay] = useState<ColumnDisplayType>({
    id: false,
    name: true,
    contact: false,
    address: true,
    created_date: true,
    email: false,
    city: true,
  });
  useEffect(() => {
    axios
      .get('http://localhost:2312/supplier')
      .then(res => {
        setSuppliers(res.data);
        setSuppliersStore(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, []);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    // change function name
    setColumnDisplay({
      ...columnDisplay,
      [e.target.name]: e.target.checked,
    });
  };

  const updateSupplier = (name: string) => {
    navigate(`/supplier-info/${name}`);
  };

  const filterUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = suppliersStore.filter((supplier: SupplierType) => {
      return supplier.name.toLowerCase().includes(term.toLowerCase());
    });
    if (!filtered.length) {
      setSuppliers([
        {
          id: 0,
          name: '',
          contact: '',
          address: '',
          created_date: '',
          email: '',
          city: '',
        },
      ]);
      return;
    }
    setSuppliers(filtered);
  };

  const display = (column_head: string) => {
    return columnDisplay[column_head as keyof ColumnDisplayType];
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        style={{ marginBottom: 9 }}
      >
        <Typography variant="h5" gutterBottom>
          Suppliers
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/add-supplier')}
          startIcon={<AddIcon />}
          style={{ backgroundColor: '#2367d1', fontWeight: 'bold' }}
        >
          supplier
        </Button>
      </Stack>
      <div className="container">
        <div className="search-filters-container">
          <input
            placeholder="search"
            className="search"
            onChange={filterUser}
          />
          <div className="filters-container">
            <div className="dropdown">
              <button className="dropBtn">
                <ViewWeekIcon /> columns
              </button>
              <div className="dropdown-content">
                {Object.keys(suppliers[0]).map(
                  (column_head: string, index: number) => (
                    <label key={index} className="switch">
                      <input
                        type="checkbox"
                        name={column_head}
                        className="checkbox"
                        onChange={handleClick}
                        checked={
                          columnDisplay[column_head as keyof ColumnDisplayType]
                        }
                      />
                      <span>{column_head}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            <button onClick={handlePrint} className="dropBtn">
              <DownloadIcon /> export
            </button>
          </div>
        </div>
        <div ref={componentRef} className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(suppliers[0]).map((column_head, index: number) => (
                  <th key={index} className={display(column_head) ? '' : 'inactive'}>
                    {column_head}
                  </th>
                ))}
              </tr>
            </thead>

            {suppliers.map((supplier, index) => (
              <tbody key={index}>
                <tr onClick={() => updateSupplier(supplier.name)}>
                  <td className={display('id') ? '' : 'inactive'}>
                    {supplier.id}
                  </td>
                  <td className="user-name">{supplier.name}</td>
                  <td className={display('contact') ? '' : 'inactive'}>
                    {supplier.contact}
                  </td>
                  <td className={display('address') ? '' : 'inactive'}>
                    {supplier.address}
                  </td>
                  <td className={display('created_date') ? '' : 'inactive'}>
                    {supplier.created_date}
                  </td>
                  <td className={display('email') ? '' : 'inactive'}>
                    {supplier.email}
                  </td>
                  <td className={display('city') ? '' : 'inactive'}>
                    {supplier.city}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};
export default Supplier;
