import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { FiX } from 'react-icons/fi';
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
  const [viewMode, setViewMode] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
    type: null // 'income' or 'expense'
  });

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

  const formatDateForCSV = (dateString) => {
    if (!dateString) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    if (/^\d{4}-\d{2}-\d{2}T/.test(dateString)) return dateString.slice(0, 10);
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const exportToCSV = () => {
    const headers = ['Total', 'Income', 'Expense'];
    const totalRow = [balance, totalIncome, totalExpense];

    const incomeSectionTitle = ['Income'];
    const incomeTableHeader = ['Date', 'Details', 'Credit'];
    const incomeRows = incomes.map(income => [
      income.date ? income.date.slice(0, 10) : "",
      `"${income.details}"`,
      income.credit
    ]);
    const expenseSectionTitle = ['Expenses'];
    const expenseTableHeader = ['Date', 'Details', 'Spend'];
    const expenseRows = expenses.map(expense => [
      expense.date ? expense.date.slice(0, 10) : "",
      `"${expense.details}"`,
      expense.spend
    ]);

    const csvContent = [
      headers.join(','),
      totalRow.join(','),
      '',
      incomeSectionTitle.join(','),
      incomeTableHeader.join(','),
      ...incomeRows.map(row => row.join(',')),
      '',
      expenseSectionTitle.join(','),
      expenseTableHeader.join(','),
      ...expenseRows.map(row => row.join(',')),
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'finance_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("CSV Content:\n", csvContent);
  };

  const handleDeleteClick = (id, type) => {
    setDeleteConfirmation({ show: true, id, type });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, id: null, type: null });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirmation.type === 'income') {
        await handleIncomeDelete(deleteConfirmation.id);
      } else {
        await handleExpenseDelete(deleteConfirmation.id);
      }
      handleCancelDelete();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="finance-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`finance-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="finance-main">
          <br />
          <h1 style={{
            textAlign: "end",
            width: "100%",
          }}>مالیات کا انتظام</h1>

          <div className="finance-actions">
            <button
              className="mode-toggle-btn"
              onClick={() => setViewMode(!viewMode)}
            >
              {viewMode ? <EditNoteIcon /> : <VisibilityIcon />}
              {viewMode ? ' ترمیم موڈ' : ' دیکھنے کا موڈ'}
            </button>
            <button
              className="export-btn"
              onClick={exportToCSV}
            >
              <FileDownloadIcon />
              CSV میں ایکسپورٹ کریں
            </button>
          </div>

          <div className="finance-summary">
            <div className="summary-card income">
              <h3>کل آمدنی</h3>
              <p>{totalIncome.toLocaleString()}</p>
            </div>
            <div className="summary-card expense">
              <h3>کل اخراجات</h3>
              <p>{totalExpense.toLocaleString()}</p>
            </div>
            <div className="summary-card balance">
              <h3>بقیہ رقم</h3>
              <p>{balance.toLocaleString()}</p>
            </div>
          </div>

          {!viewMode && (
            <div className="finance-tabs">
              <button
                className={`tab-btn ${activeTab === "incomes" ? "active" : ""}`}
                onClick={() => setActiveTab("incomes")}
              >
                آمدنی
              </button>
              <button
                className={`tab-btn ${activeTab === "expenses" ? "active" : ""}`}
                onClick={() => setActiveTab("expenses")}
              >
                اخراجات
              </button>
            </div>
          )}

          {viewMode ? (
            <div className="finance-viewmode-tables">
              <div className="finance-table">
                <h2>آمدنی</h2>
                <table>
                  <thead>
                    <tr>
                      <th>تاریخ</th>
                      <th>تفصیلات</th>
                      <th>رقم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes?.map((income) => (
                      <tr key={income._id}>
                        <td>{new Date(income.date).toLocaleDateString()}</td>
                        <td>{income.details}</td>
                        <td>{income.credit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="finance-table">
                <h2>اخراجات</h2>
                <table>
                  <thead>
                    <tr>
                      <th>تاریخ</th>
                      <th>تفصیلات</th>
                      <th>رقم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses?.map((expense) => (
                      <tr key={expense._id}>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.details}</td>
                        <td>{expense.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            activeTab === "incomes" ? (
              <>
                <form onSubmit={handleIncomeSubmit} className="finance-form">
                  <div className="form-group">
                    <label>تاریخ</label>
                    <input
                      type="date"
                      name="date"
                      value={incomeFormData.date}
                      onChange={handleIncomeChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>تفصیلات</label>
                    <input
                      type="text"
                      name="details"
                      value={incomeFormData.details}
                      onChange={handleIncomeChange}
                      placeholder="آمدنی کی تفصیلات درج کریں"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>رقم</label>
                    <input
                      type="number"
                      name="credit"
                      value={incomeFormData.credit}
                      onChange={handleIncomeChange}
                      placeholder="رقم درج کریں"
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    {editMode ? "آمدنی اپ ڈیٹ کریں" : "آمدنی شامل کریں"}
                  </button>
                </form>

                {incomesLoading && <div className="loading">لوڈ ہو رہا ہے...</div>}
                {incomesError && <div className="error">{incomesError}</div>}

                <div className="finance-table">
                  <table>
                    <thead>
                      <tr>
                        <th>تاریخ</th>
                        <th>تفصیلات</th>
                        <th>رقم</th>
                        <th>اعمال</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomes?.map((income) => (
                        <tr key={income._id}>
                          <td style={{width: "30%", padding: "10px"}}>{new Date(income.date).toLocaleDateString()}</td>
                          <td style={{width: "40%", padding: "10px"}}>{income.details}</td>
                          <td style={{width: "30%", padding: "10px"}}>{income.credit}</td>
                          <td id="actions" style={{width: window.innerWidth < 768 ? "" : "30%", padding: "10px"}}>
                            <button
                              className="edit-btn"
                              onClick={() => handleIncomeEdit(income)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteClick(income._id, 'income')}
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
                    <label>تاریخ</label>
                    <input
                      type="date"
                      name="date"
                      value={expenseFormData.date}
                      onChange={handleExpenseChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>تفصیلات</label>
                    <input
                      type="text"
                      name="details"
                      value={expenseFormData.details}
                      onChange={handleExpenseChange}
                      placeholder="اخراجات کی تفصیلات درج کریں"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>رقم</label>
                    <input
                      type="number"
                      name="spend"
                      value={expenseFormData.spend}
                      onChange={handleExpenseChange}
                      placeholder="رقم درج کریں"
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    {editMode ? "اخراجات اپ ڈیٹ کریں" : "اخراجات شامل کریں"}
                  </button>
                </form>

                {expensesLoading && <div className="loading">لوڈ ہو رہا ہے...</div>}
                {expensesError && <div className="error">{expensesError}</div>}

                <div className="finance-table">
                  <table>
                    <thead>
                      <tr style={{gap: "20px !important"}}>
                        <th>تاریخ</th>
                        <th>تفصیلات</th>
                        <th>رقم</th>
                        <th>اعمال</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses?.map((expense) => (
                        <tr key={expense._id}>
                          <td style={{width: "30%", padding: "10px"}}>{new Date(expense.date).toLocaleDateString()}</td>
                          <td style={{width: "40%", padding: "10px"}}>{expense.details}</td>
                          <td style={{width: "30%", padding: "10px"}}>{expense.spend}</td>
                          <td id="actions" style={{width: window.innerWidth < 768 ? "" : "30%", padding: "10px"}}>
                            <button
                              className="edit-btn"
                              onClick={() => handleExpenseEdit(expense)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteClick(expense._id, 'expense')}
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
            )
          )}
        </div>
      </div>
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <h2>حذف کرنے کی تصدیق</h2>
              <button
                className="modal-close-btn"
                onClick={handleCancelDelete}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                کیا آپ واقعی اس {deleteConfirmation.type === 'income' ? 'آمدنی' : 'خرچ'} کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس
                نہیں کیا جا سکتا۔
              </p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelDelete}>
                منسوخ کریں
              </button>
              <button
                className="delete-btn"
                onClick={handleConfirmDelete}
              >
                حذف کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance; 