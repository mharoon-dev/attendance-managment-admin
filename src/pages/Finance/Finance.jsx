import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  getIncomesStart,
  getIncomesSuccess,
  getIncomesFailure,
  addIncomeStart,
  addIncomeSuccess,
  addIncomeFailure,
  updateIncomeStart,
  updateIncomeSuccess,
  updateIncomeFailure,
  deleteIncomeStart,
  deleteIncomeSuccess,
  deleteIncomeFailure,
} from "../../redux/slices/incomesSlice";
import {
  getExpensesStart,
  getExpensesSuccess,
  getExpensesFailure,
  addExpenseStart,
  addExpenseSuccess,
  addExpenseFailure,
  updateExpenseStart,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpenseStart,
  deleteExpenseSuccess,
  deleteExpenseFailure,
} from "../../redux/slices/expensesSlice";
import { api } from "../../utils/url.js";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./Finance.css";
import useSidebar from "../../hooks/useSidebar.js";

const Finance = () => {
  const dispatch = useDispatch();
  const { incomes, loading: incomesLoading, error: incomesError } = useSelector((state) => state.incomes);
  const { expenses, loading: expensesLoading, error: expensesError } = useSelector((state) => state.expenses);
  const [activeTab, setActiveTab] = useState("incomes");
  const [incomeFormData, setIncomeFormData] = useState({
    date: "",
    details: "",
    credit: "",
  });
  const [expenseFormData, setExpenseFormData] = useState({
    date: "",
    details: "",
    spend: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { sidebarOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
  }, []);

  const fetchIncomes = async () => {
    try {
      dispatch(getIncomesStart());
      const response = await api.get("incomes");
      dispatch(getIncomesSuccess(response.data.data));
    } catch (error) {
      dispatch(getIncomesFailure(error.message));
    }
  };

  const fetchExpenses = async () => {
    try {
      dispatch(getExpensesStart());
      const response = await api.get("expenses");
      dispatch(getExpensesSuccess(response.data.data));
    } catch (error) {
      dispatch(getExpensesFailure(error.message));
    }
  };

  const handleIncomeChange = (e) => {
    setIncomeFormData({ ...incomeFormData, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e) => {
    setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        dispatch(updateIncomeStart());
        const response = await api.put(`incomes/update/${editId}`, incomeFormData);
        dispatch(updateIncomeSuccess(response.data.data));
        setEditMode(false);
        setEditId(null);
      } else {
        dispatch(addIncomeStart());
        const response = await api.post("incomes/add", incomeFormData);
        dispatch(addIncomeSuccess(response.data.data));
      }
      setIncomeFormData({ date: "", details: "", credit: "" });
    } catch (error) {
      dispatch(editMode ? updateIncomeFailure : addIncomeFailure)(error.message);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        dispatch(updateExpenseStart());
        const response = await api.put(`expenses/update/${editId}`, expenseFormData);
        dispatch(updateExpenseSuccess(response.data.data));
        setEditMode(false);
        setEditId(null);
      } else {
        dispatch(addExpenseStart());
        const response = await api.post("expenses/add", expenseFormData);
        dispatch(addExpenseSuccess(response.data.data));
      }
      setExpenseFormData({ date: "", details: "", spend: "" });
    } catch (error) {
      dispatch(editMode ? updateExpenseFailure : addExpenseFailure)(error.message);
    }
  };

  const handleIncomeEdit = (income) => {
    setIncomeFormData({
      date: income.date,
      details: income.details,
      credit: income.credit,
    });
    setEditMode(true);
    setEditId(income._id);
    setActiveTab("incomes");
  };

  const handleExpenseEdit = (expense) => {
    setExpenseFormData({
      date: expense.date,
      details: expense.details,
      spend: expense.spend,
    });
    setEditMode(true);
    setEditId(expense._id);
    setActiveTab("expenses");
  };

  const handleIncomeDelete = async (id) => {
    try {
      dispatch(deleteIncomeStart());
      await api.delete(`incomes/delete/${id}`);
      dispatch(deleteIncomeSuccess(id));
    } catch (error) {
      dispatch(deleteIncomeFailure(error.message));
    }
  };

  const handleExpenseDelete = async (id) => {
    try {
      dispatch(deleteExpenseStart());
      await api.delete(`expenses/delete/${id}`);
      dispatch(deleteExpenseSuccess(id));
    } catch (error) {
      dispatch(deleteExpenseFailure(error.message));
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.credit), 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.spend), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="finance-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`finance-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="finance-main">
          <br />
          <h1>Finance Management</h1>

          <div className="finance-summary">
            <div className="summary-card income">
              <h3>Total Income</h3>
              <p>{totalIncome.toLocaleString()}</p>
            </div>
            <div className="summary-card expense">
              <h3>Total Expense</h3>
              <p>{totalExpense.toLocaleString()}</p>
            </div>
            <div className="summary-card balance">
              <h3>Balance</h3>
              <p>{balance.toLocaleString()}</p>
            </div>
          </div>

          <div className="finance-tabs">
            <button
              className={`tab-btn ${activeTab === "incomes" ? "active" : ""}`}
              onClick={() => setActiveTab("incomes")}
            >
              Incomes
            </button>
            <button
              className={`tab-btn ${activeTab === "expenses" ? "active" : ""}`}
              onClick={() => setActiveTab("expenses")}
            >
              Expenses
            </button>
          </div>

          {activeTab === "incomes" ? (
            <>
              <form onSubmit={handleIncomeSubmit} className="finance-form">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={incomeFormData.date}
                    onChange={handleIncomeChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <input
                    type="text"
                    name="details"
                    value={incomeFormData.details}
                    onChange={handleIncomeChange}
                    placeholder="Enter income details"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="credit"
                    value={incomeFormData.credit}
                    onChange={handleIncomeChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  {editMode ? "Update Income" : "Add Income"}
                </button>
              </form>

              {incomesLoading && <div className="loading">Loading...</div>}
              {incomesError && <div className="error">{incomesError}</div>}

              <div className="finance-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Details</th>
                      <th>Credit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes?.map((income) => (
                      <tr key={income._id}>
                        <td style={{width: "30%", padding: "10px"}}>{new Date(income.date).toLocaleDateString()}</td>
                        <td style={{width: "40%", padding: "10px"}}>{income.details}</td>
                        <td style={{width: "30%", padding: "10px"}}>{income.credit}</td>
                        <td id="actions" style={{width: "30%", padding: "10px"}}>
                          <button
                            className="edit-btn"
                            onClick={() => handleIncomeEdit(income)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleIncomeDelete(income._id)}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleExpenseSubmit} className="finance-form">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={expenseFormData.date}
                    onChange={handleExpenseChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <input
                    type="text"
                    name="details"
                    value={expenseFormData.details}
                    onChange={handleExpenseChange}
                    placeholder="Enter expense details"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="spend"
                    value={expenseFormData.spend}
                    onChange={handleExpenseChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  {editMode ? "Update Expense" : "Add Expense"}
                </button>
              </form>

              {expensesLoading && <div className="loading">Loading...</div>}
              {expensesError && <div className="error">{expensesError}</div>}

              <div className="finance-table">
                <table>
                  <thead>
                    <tr style={{gap: "20px !important"}}>
                      <th>Date</th>
                      <th>Details</th>
                      <th>Spend</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses?.map((expense) => (
                      <tr key={expense._id}>
                        <td style={{width: "30%", padding: "10px"}}>{new Date(expense.date).toLocaleDateString()}</td>
                        <td style={{width: "40%", padding: "10px"}}>{expense.details}</td>
                        <td style={{width: "30%", padding: "10px"}}>{expense.spend}</td>
                        <td id="actions" style={{width: "30%", padding: "10px"}}>
                          <button
                            className="edit-btn"
                            onClick={() => handleExpenseEdit(expense)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleExpenseDelete(expense?._id)}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance; 