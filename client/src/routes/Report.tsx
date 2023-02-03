import React, { useState, useEffect } from 'react'
import { data } from '../features/Mock';
import { Bar } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type NumberOfUnitsSoldChart = {
  label: string[],
  datasets: { data: number[] }[],
}


const Report: React.FC = () => {
  console.log('reporting file.');
  const date = new Date();
  const month = date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  const [currentMonthYear, setCurrentMonthYear] = useState<string>(`${month} ${year}`);
  const [unitsSold, setUnistsSold] = useState<number>();
  const [unitsBought, setUnistsBought] = useState<number>();
  const [revenue, setRevenue] = useState<number>();
  const [expense, setExpense] = useState<number>();
  const [numberOfUnitsSoldChart, setNumberOfUnitsSoldChart] = useState<NumberOfUnitsSoldChart[]>();
  const [revenueGotInMonth, setRevnueGotInMonth] = useState<NumberOfUnitsSoldChart[]>();
  const [expenseGotInMonth, setExpenseGotInMonth] = useState<NumberOfUnitsSoldChart[]>();

  useEffect(() => {
    axios.post('http://localhost:2312/sell/units/report', { dateStr: currentMonthYear })
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error");
          return;
        }
        setUnistsSold(resp.data.units);
        setRevenue(resp.data.revenue);
      }).catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/purchase/monthly/report', { dateStr: currentMonthYear })
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error");
          return;
        }
        setUnistsBought(resp.data.units);
        setExpense(resp.data.expense);
      }).catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/sell/monthly/units_sold', { dateStr: currentMonthYear })
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error")
          return;
        };
        setNumberOfUnitsSoldChart(resp.data);
      }).catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/sell/monthly/revenue', { dateStr: currentMonthYear })
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error")
          return;
        };
        setRevnueGotInMonth(resp.data);
      }).catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/purchase/monthly/expense', { dateStr: currentMonthYear })
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error")
          return;
        };
        setExpenseGotInMonth(resp.data);
      }).catch(error => {
        toast.error(error.message);
      });

  }, [])

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

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 128,
            height: 128,
          },
        }}
      >
        <Paper style={{ padding: '3px' }} elevation={3} >
          <h3>Units Sold </h3>
          <p> {unitsSold} </p>
        </Paper>
        <Paper style={{ padding: '3px' }} elevation={3} >
          <h3>Units Bought </h3>
          <p> {unitsBought} </p>
        </Paper>
        <Paper style={{ padding: '3px' }} elevation={3} >
          <h3>Revenue</h3>
          <p> $ {revenue} </p>
        </Paper>
        <Paper style={{ padding: '3px' }} elevation={3} >
          <h3>Expense</h3>
          <p> $ {expense} </p>
        </Paper>
      </Box>
      <div className='chart-container'>
        {numberOfUnitsSoldChart && <Bar data={numberOfUnitsSoldChart} />}
        {revenueGotInMonth && <Bar data={revenueGotInMonth} />}
        {expenseGotInMonth && <Bar data={expenseGotInMonth} />}
      </div>
    </>

  );
}

export default Report;
