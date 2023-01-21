import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
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
  id: string;
  paid: string;
  total: string;
  purchase_date: string;
};
type CustomerDebtType = {
  customer: string;
  amount: string;
  recordeddate: string;
};
type SupplierDebtType = {
  supplier: string;
  initial_amount: string;
  recorded_date: string;
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
    { id: "", paid: "", total: "", purchase_date: "" },
  ]);
  const [customerDebts, setCustomerDebts] = useState<CustomerDebtType[]>([
    { customer: "", amount: "", recordeddate: "" },
  ]);
  const [supplierDebts, setSupplierDebts] = useState<SupplierDebtType[]>([
    { supplier: "", initial_amount: "", recorded_date: "" },
  ]);
  const [monthRevenue, setMonthRevenue] = useState<string>(currentMonth);
  const [monthCustomerDebt, setMonthCustomerDebt] =
    useState<string>(currentMonth);
  const [monthSupplierDebt, setMonthSupplierDebt] =
    useState<string>(currentMonth);
  const [monthExpense, setMonthExpense] = useState<string>("01 2023");
  const [dateRevenue, setDateRevenue] = useState<string>("");
  const [dateExpense, setDateExpense] = useState<string>("");
  const [dateCustomerDebt, setDateCustomerDebt] = useState<string>("");
  const [dateSupplierDebt, setDateSupplierDebt] = useState<string>("");
  useEffect(() => {
    axios.post("http://localhost:2312/sell/revenue", { dateStr: monthRevenue }).then((res) => {
      if (res.data == "error") {
        toast.error("SERVER: qalad ayaa dhacay");
        return;
      }
      setRevenues(res.data);
    })
      .catch(error => {
        toast.error(error.message)
      })

    axios
      .post("http://localhost:2312/debt/sells/date", { dateStr: monthCustomerDebt })
      .then((res) => {
        if (res.data == "error") {
          toast.error("SERVER: qalad ayaa dhacay");
          return;
        }
        setCustomerDebts(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      })

    axios
      .post("http://localhost:2312/debt/purchase/date", { dateStr: monthSupplierDebt })
      .then((res) => {
        if (res.data == "error") {
          toast.error("SERVER: qalad ayaa dhacay");
          return;

        }
        setSupplierDebts(res.data);
      })
      .catch(error => {
        toast.error(error.message)
      })

    axios.post("http://localhost:2312/purchase/expense", { dateStr: monthExpense }).then((res) => {
      if (res.data == "error") {
        toast.error("SERVER: qalad ayaa dhacay");
        return;
      }
      setExpenses(res.data);
    })
      .catch(error => {
        toast.error(error.message);
      })
  }, []);

  const getRest = (total: string, paid: string) => {
    let totalAmount: number = parseFloat(total);
    let paidAmount: number = parseFloat(paid);
    if (isNaN(totalAmount)) totalAmount = 0;
    if (isNaN(paidAmount)) paidAmount = 0;
    return totalAmount - paidAmount;
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

  const getTotal = () => {
    let totalRevenue: number = 0;
    let paidRevenue: number = 0;
    let totalExpense: number = 0;
    let paidExpense: number = 0;
    for (let revenue of revenues) {
      let rev = parseFloat(revenue.total);
      if (!rev) rev = 0;
      totalRevenue += Math.floor(rev * 100) / 100;
    }
    for (let revenue of revenues) {
      let rev = parseFloat(revenue.paid);
      if (!rev) rev = 0;
      paidRevenue += Math.floor(rev * 100) / 100;
    }

    for (let expense of expenses) {
      let exp = parseFloat(expense.total);
      if (!exp) exp = 0
      totalExpense += Math.floor(exp * 100) / 100;
    }
    for (let expense of expenses) {
      let exp: number = parseFloat(expense.paid);
      if (!exp) exp = 0;
      paidExpense += Math.floor(exp * 100) / 100;
    }
    return { totalRevenue, paidRevenue, totalExpense, paidExpense };
  };

  const handleMonthRevenue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRevenue(e.target.value);
  };
  const getRevenueByDate = () => {
    axios.post("http://localhost:2312/sell/revenue", { dateStr: dateRevenue }).then((res) => {
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
    }).catch(error => {
      toast.error(error.message);
    });
  };

  const getCustomerDebtByDate = () => {
    axios
      .post("http://localhost:2312/debt/sells/date", { dateStr: dateCustomerDebt })
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
      }).catch(error => {
        toast.error(error.message);
      });
  };

  const getSupplierDebtByDate = () => {
    axios
      .post("http://localhost:2312/debt/purchase/date", { dateStr: dateSupplierDebt })
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
      }).catch(error => {
        toast.error(error.message);
      });
  };

  const getExpenseByDate = () => {
    axios.post("http://localhost:2312/purchase/expense", { dateStr: dateExpense }).then((res) => {
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
    }).catch(error => {
      toast.error(error.message);
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
      total += parseFloat(debt.initial_amount);
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
            Revenue: {monthRevenue}
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
                {revenues.map((revenue, index: number) => (
                  <tbody key={index}>
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
                      ${getTotal().paidRevenue}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal().totalRevenue}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      $
                      {getTotal().totalRevenue -
                        getTotal().paidRevenue}
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
          <Typography variant="body1">your debt: {monthCustomerDebt}</Typography>
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
                {customerDebts.map((debt, index: number) => (
                  <tbody key={index}>
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
            Expenses {monthExpense}
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
                    <th>id</th>
                    <th>paid</th>
                    <th>total</th>
                    <th>rest</th>
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
                          onClick={() => goPurchasePaper(expense.id)}
                        >
                          {expense.id}
                        </Button>
                      </td>
                      <td>${expense.paid}</td>
                      <td>${expense.total}</td>
                      <td>${getRest(expense.total, expense.paid)}</td>
                      <td>{expense.purchase_date}</td>
                    </tr>
                  </tbody>
                ))}
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>total</td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal().paidExpense}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      ${getTotal().totalExpense}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      $
                      {Math.floor((getTotal().totalExpense - getTotal().paidExpense) * 100) / 100}
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
                {supplierDebts.map((debt, index: number) => (
                  <tbody key={index}>
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
                      <td>${debt.initial_amount}</td>
                      <td>${debt.recorded_date}</td>
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
