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
  const [ unitsSold, setUnistsSold ] = useState<number>();
  const [ numberOfUnitsSoldChart, setNumberOfUnitsSoldChart] = useState<NumberOfUnitsSoldChart[]>();
  const [ revenueGotInMonth, setRevnueGotInMonth] = useState<NumberOfUnitsSoldChart[]>();
  const [ revenue, setRevenue ] = useState<number>();

  useEffect(() => {
    axios.post('http://localhost:2312/sell/units/report', {date: '2023-01-29'})
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

    axios.post('http://localhost:2312/sell/monthly/units_sold', {dateStr: '01 2023'})
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error")
          return;
        };
        setNumberOfUnitsSoldChart(resp.data);
      }) .catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/sell/monthly/revenue', {dateStr: '01 2023'})
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error")
          return;
        };
        setRevnueGotInMonth(resp.data);
      }) .catch(error => {
        toast.error(error.message);
      });
  }, [])

  console.log('chart',numberOfUnitsSoldChart);

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
        <Paper style={{ padding: '3px'}} elevation={3} >
          <h3>Units Sold </h3>
          <p> { unitsSold } </p>
        </Paper>
        <Paper style={{ padding: '3px'}} elevation={3} >
          <h3>Revenue</h3>
          <p> $ { revenue } </p>
        </Paper>
      </Box> 
      <div className='chart-container'>
        {numberOfUnitsSoldChart && <Bar  data={numberOfUnitsSoldChart} />}
        {revenueGotInMonth && <Bar  data={revenueGotInMonth} />}
      </div>
    </>

  );
}

export default Report;
