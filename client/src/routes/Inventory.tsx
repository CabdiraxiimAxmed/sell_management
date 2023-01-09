import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import AddProduct from '../components/AddProduct';
import EditProduct from '../components/EditProduct';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Box, Stack, Typography, Button } from '@mui/material';
import { ProductionQuantityLimits } from '@mui/icons-material';

export type ProductType = {
  id: number;
  name: string;
  supplier: string;
  quantity: number;
  alertquantity: number;
  barcode: string;
  price: string;
};
type ColumnDisplayType = {
  id: boolean;
  name: boolean;
  supplier: boolean;
  quantity: boolean;
  alertquantity: boolean;
  barcode: boolean;
  price: boolean;
};
const Products: React.FC = () => {
  const navigate = useNavigate();
  const [addProduct, setAddProduct] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<ProductType>({
    id: 0,
    name: '',
    supplier: '',
    quantity: 0,
    alertquantity: 0,
    barcode: '',
    price: '',
  });
  const [products, setProducts] = useState<ProductType[]>([
    {
      id: 0,
      name: '',
      supplier: '',
      quantity: 0,
      alertquantity: 0,
      barcode: '',
      price: '',
    },
  ]);
  const [productsStore, setProductsStore] = useState<ProductType[]>([
    {
      id: 0,
      name: '',
      supplier: '',
      quantity: 0,
      alertquantity: 0,
      barcode: '',
      price: '',
    },
  ]);
  const [columnDisplay, setColumnDisplay] = useState<ColumnDisplayType>({
    id: true,
    name: true,
    supplier: true,
    quantity: true,
    alertquantity: true,
    barcode: true,
    price: true,
  });
  useEffect(() => {
    axios
      .get('/products')
      .then(res => {
        setProducts(res.data);
        setProductsStore(res.data);
      })
      .catch(err => {
        toast.error('qalad ayaa dhacay');
      });
  }, []);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    // change function name
    setColumnDisplay({
      ...columnDisplay,
      [e.target.name]: e.target.checked,
    });
  };

  const filterUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = productsStore.filter((product: ProductType) => {
      return product.name.toLowerCase().includes(term.toLowerCase());
    });
    if (!filtered.length) {
      setProducts([
        {
          id: 0,
          name: '',
          supplier: '',
          quantity: 0,
          alertquantity: 0,
          barcode: '',
          price: '',
        },
      ]);
      return;
    }
    setProducts(filtered);
  };

  const display = (column_head: string) => {
    return columnDisplay[column_head as keyof ColumnDisplayType];
  };

  const handleEditProduct = (id: number) => {
    let foundProduct: ProductType = products.filter((product: ProductType) => {
      return product.id === id;
    })[0];
    if (!foundProduct.name) return;
    setProductToEdit(foundProduct);
    setEditProduct(!editProduct);
  };

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
      {addProduct && <AddProduct />}
      {editProduct && <EditProduct product={productToEdit} />}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        style={{ marginBottom: 9 }}
      >
        <Typography variant="h5" gutterBottom>
          Badeecada
        </Typography>
        <Button
          variant="contained"
          onClick={() => setAddProduct(!addProduct)}
          startIcon={<AddIcon />}
          style={{ backgroundColor: '#2367d1', fontWeight: 'bold' }}
        >
          badeeco
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
                {Object.keys(products[0]).map(
                  (column_head: string, index: number) => (
                    <label className="switch">
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
            <button className="dropBtn">
              <DownloadIcon /> export
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(products[0]).map((column_head, index) => (
                  <th className={display(column_head) ? '' : 'inactive'}>
                    {column_head}
                  </th>
                ))}
              </tr>
            </thead>

            {products.map((product: ProductType, index: number) => (
              <tbody key={index}>
                <tr>
                  <td className={display('id') ? '' : 'inactive'}>
                    {product.id}
                  </td>
                  <td className="user-name">{product.name}</td>
                  <td className={display('supplier') ? '' : 'inactive'}>
                    {product.supplier}
                  </td>
                  <td className={display('quantity') ? '' : 'inactive'}>
                    {product.quantity}
                  </td>
                  <td className={display('alertquantity') ? '' : 'inactive'}>
                    {product.alertquantity}
                  </td>
                  <td className={display('barcode') ? '' : 'inactive'}>
                    {product.barcode}
                  </td>
                  <td className={display('price') ? '' : 'inactive'}>
                    {product.price}
                  </td>
                  <td>
                    <button
                      className="editBtn"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Edit
                    </button>
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
export default Products;
