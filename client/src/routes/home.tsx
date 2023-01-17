import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  AppBar,
  Container,
  Toolbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import axios from "axios";

type RevenueType = {
  order_id: string;
  paid: string;
  total: string;
  created_date: string;
};

type ExpenseType = {
  order_id: string;
  paid: string;
  total: string;
  order_date: string;
};
type CustomerDebtType = {
  customer: string;
  amount: string;
  recordeddate: string;
};
type SupplierDebtType = {
  supplier: string;
  amount: string;
  recordeddate: string;
};
const Home: React.FC = () => {
  const navigate = useNavigate();
  const month = moment().format("MMMM");
  const year = moment().format("YYYY");
  let currentMonth = `${month} ${year}`;
  const [revenues, setRevenues] = useState<RevenueType[]>([
    { order_id: "", paid: "", total: "", created_date: "" },
  ]);
  const [expenses, setExpenses] = useState<ExpenseType[]>([
    { order_id: "", paid: "", total: "", order_date: "" },
  ]);
  const [customerDebts, setCustomerDebts] = useState<CustomerDebtType[]>([
    { customer: "", amount: "", recordeddate: "" },
  ]);
  const [supplierDebts, setSupplierDebts] = useState<SupplierDebtType[]>([
    { supplier: "", amount: "", recordeddate: "" },
  ]);
  const [monthRevenue, setMonthRevenue] = useState<string>(currentMonth);
  const [monthCustomerDebt, setMonthCustomerDebt] =
    useState<string>(currentMonth);
  const [monthSupplierDebt, setMonthSupplierDebt] =
    useState<string>(currentMonth);
  const [monthExpense, setMonthExpense] = useState<string>("12 2022");
  const [dateRevenue, setDateRevenue] = useState<string>("");
  const [dateExpense, setDateExpense] = useState<string>("");
  const [dateCustomerDebt, setDateCustomerDebt] = useState<string>("");
  const [dateSupplierDebt, setDateSupplierDebt] = useState<string>("");
 useEffect(() => {
    axios.post("/sell/revenue", { dateStr: monthRevenue }).then((res) => {
      if (res.data == "error") {
        toast.error("SERVER: qalad ayaa dhacay");
        return;
      }
      setRevenues(res.data);
    });

    axios
      .post("/debt/sells/date", { dateStr: monthCustomerDebt })
      .then((res) => {
        if (res.data == "error") {
          toast.error("SERVER: qalad ayaa dhacay");
          return;
        }
        setCustomerDebts(res.data);
      });

    axios
      .post("/debt/purchase/date", { dateStr: monthSupplierDebt })
      .then((res) => {
        if (res.data == "error") {
          toast.error("SERVER: qalad ayaa dhacay");
          return;
        }
        setSupplierDebts(res.data);
      });

    axios.post("/purchase/expense", { dateStr: monthExpense }).then((res) => {
      if (res.data == "error") {
        toast.error("SERVER: qalad ayaa dhacay");
        return;
      }
      setExpenses(res.data);
    });
  }, []);

  const getRest = (total: string, paid: string) => {
    return parseFloat(total) - parseFloat(paid);
  };

  const goSellPaper = (id: string) => {
    navigate(`/sells/${id}`);
  };

  const goPurchasePaper = (id: string) => {
    navigate(`/purchase-order/${id}`);
  };

  const goCustomer = (name: string) => {
    navigate(`/customer-info/${name}`);
  };

  const getTotal = (term: string) => {
    let totalRevenue: number = 0;
    let paidRevenue: number = 0;
    let totalExpense: number = 0;
    let paidExpense: number = 0;
    for (let revenue of revenues) {
      totalRevenue += parseFloat(revenue.total);
    }
    for (let revenue of revenues) {
      paidRevenue += parseFloat(revenue.paid);
    }

    for (let expense of expenses) {
      totalExpense += parseFloat(expense.total);
    }
    for (let expense of expenses) {
      paidExpense += parseFloat(expense.paid);
    }
    return { totalRevenue, paidRevenue, totalExpense, paidExpense };
  };

  const handleMonthRevenue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRevenue(e.target.value);
  };
  const getRevenueByDate = () => {
    axios.post("/sell/revenue", { dateStr: dateRevenue }).then((res) => {
      if (res.data == "error") {
        toast.error("SERVER: qalad ayaa dhacay");
        return;
      }
      if (res.data === "correct") {
        toast.warn("fadlan qoraalka sax");
        return;
      }
      setRevenues(res.data);
      setMonthRevenue(dateRevenue);
    });
  };

  const getCustomerDebtByDate = () => {
    axios
      .post("/debt/sells/date", { dateStr: dateCustomerDebt })
      .then((res) => {
        if (res.data == "error") {
          toast.error("SERVER: qalad ayaa dhacay");
          return;
        }
        if (res.data === "correct") {
          toast.warn("fadlan qoraalka sax");
          return;
        }
        setCustomerDebts(res.data);
        setMonthCustomerDebt(dateCustomerDebt);
      });
  };

  const getSupplierDebtByDate = () => {
    axios
      .post("/debt/purchase/date", { dateStr: dateSupplierDebt })
      .then((res) => {
        if (res.data == "error") {
          toast.error("SERVER: qalad ayaa dhacay");
          return;
        }
        if (res.data === "correct") {
          toast.warn("fadlan qoraalka sax");
          return;
        }
        setSupplierDebts(res.data);
        setMonthSupplierDebt(dateSupplierDebt);
      });
  };

  const getExpenseByDate = () => {
    axios.post("/purchase/expense", { dateStr: dateExpense }).then((res) => {
      if (res.data == "error") {
        toast.error("SERVER: qalad ayaa dhacay");
        return;
      }
      if (res.data === "correct") {
        toast.warn("fadlan qoraalka sax");
        return;
      }
      setExpenses(res.data);
      setMonthExpense(dateExpense);
    });
  };

  const getCustomerDebtTotal = () => {
    let total: number = 0;
    for (let debt of customerDebts) {
      total += parseFloat(debt.amount);
    }
    return total;
  };

  const getSupplierDebtTotal = () => {
    let total: number = 0;
    for (let debt of supplierDebts) {
      total += parseFloat(debt.amount);
    }
    return total;
  };

  return (
    <Grid container spacing={2}>
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

      <Grid item xs={6}>
        <div className="report-display-container">
          <Typography variant="body1">
            Daqliga kuso galay {monthRevenue}
          </Typography>
          <TextField
            InputProps={{ sx: { height: 34 } }}
            onChange={handleMonthRevenue}
          />
          <IconButton
            color="primary"
            style={{ transform: "translateY(-10px)" }}
            onClick={getRevenueByDate}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
          <div className="report-display-table-container">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>order_id</th>
                    <th>paid</th>
                    <th>total</th>
                    <th>pending</th>
                    <th>created_date</th>
                  </tr>
                </thead>
                {revenues.map((revenue, index) => (
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <Button
                          variant="text"
                          onClick={() => goSellPaper(revenue.order_id)}
                        >
                          {revenue.order_id}
                        </Button>
                      </td>
                      <td>${revenue.paid}</td>
                      <td>${revenue.total}</td>
                      <td>${getRest(revenue.total, revenue.paid)}</td>
                      <td>{revenue.created_date}</td>
                    </tr>
                  </tbody>
                ))}
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>total</td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal("paid").paidRevenue}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal("paid").totalRevenue}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      $
                      {getTotal("paid").totalRevenue -
                        getTotal("paid").paidRevenue}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="report-display-container">
          <Typography variant="body1">dayntaada {monthCustomerDebt}</Typography>
          <TextField
            InputProps={{ sx: { height: 34 } }}
            onChange={(e) => setDateCustomerDebt(e.target.value)}
          />
          <IconButton
            color="primary"
            style={{ transform: "translateY(-10px)" }}
            onClick={getCustomerDebtByDate}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
          <div className="report-display-table-container">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>customer</th>
                    <th>cadadka</th>
                    <th>recorded_date</th>
                  </tr>
                </thead>
                {customerDebts.map((debt, index) => (
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <Button
                          variant="text"
                          onClick={() => goCustomer(debt.customer)}
                        >
                          {debt.customer}
                        </Button>
                      </td>
                      <td>${debt.amount}</td>
                      <td>${debt.recordeddate}</td>
                    </tr>
                  </tbody>
                ))}
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>total</td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getCustomerDebtTotal()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="report-display-container">
          <Typography variant="body1">
            Daqliga kaa baxay {monthExpense}
          </Typography>
          <TextField
            InputProps={{ sx: { height: 34 } }}
            onChange={(e) => setDateExpense(e.target.value)}
          />
          <IconButton
            color="primary"
            style={{ transform: "translateY(-10px)" }}
            onClick={getExpenseByDate}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
          <div className="report-display-table-container">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>order_id</th>
                    <th>paid</th>
                    <th>total</th>
                    <th>pending</th>
                    <th>order_date</th>
                  </tr>
                </thead>
                {expenses.map((expense: ExpenseType, index: number) => (
                  <tbody key={index}>
                    <tr>
                      <td>
                        {" "}
                        <Button
                          variant="text"
                          onClick={() => goPurchasePaper(expense.order_id)}
                        >
                          {expense.order_id}
                        </Button>
                      </td>
                      <td>${expense.paid}</td>
                      <td>${expense.total}</td>
                      <td>${getRest(expense.total, expense.paid)}</td>
                      <td>{expense.order_date}</td>
                    </tr>
                  </tbody>
                ))}
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>total</td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal("paid").paidExpense}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal("paid").totalExpense}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      $
                      {getTotal("paid").totalExpense -
                        getTotal("paid").paidExpense}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="report-display-container">
          <Typography variant="body1">
            daynta supplier {monthSupplierDebt}
          </Typography>
          <TextField
            InputProps={{ sx: { height: 34 } }}
            onChange={(e) => setDateSupplierDebt(e.target.value)}
          />
          <IconButton
            color="primary"
            style={{ transform: "translateY(-10px)" }}
            onClick={getSupplierDebtByDate}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
          <div className="report-display-table-container">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>supplier</th>
                    <th>cadadka</th>
                    <th>recorded_date</th>
                  </tr>
                </thead>
                {supplierDebts.map((debt, index) => (
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <Button
                          variant="text"
                          onClick={() =>
                            navigate(`/supplier-info/${debt.supplier}`)
                          }
                        >
                          {debt.supplier}
                        </Button>
                      </td>
                      <td>${debt.amount}</td>
                      <td>${debt.recordeddate}</td>
                    </tr>
                  </tbody>
                ))}
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>total</td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getSupplierDebtTotal()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Home;
