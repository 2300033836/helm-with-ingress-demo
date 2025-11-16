import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const API_URL = import.meta.env.VITE_API_URL; // 👈 load from .env
  console.log("Backend API URL:", API_URL); // helpful for debugging

  const [expense, setExpense] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    paymentMethod: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  // fetch all expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`);
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Unable to connect to backend. Check API or network.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // add or update expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseToSend = {
      ...expense,
      amount: Number(expense.amount),
    };

    try {
      const url = editId
        ? `${API_URL}/api/expenses/${editId}`
        : `${API_URL}/api/expenses`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseToSend),
      });

      if (!response.ok) throw new Error("Failed to save expense");

      setExpense({
        title: "",
        category: "",
        amount: "",
        date: "",
        paymentMethod: "",
      });
      setEditId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Failed to save expense. Please check your API connection.");
    }
  };

  // delete expense
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete expense");
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense.");
    }
  };

  // edit expense
  const handleEdit = (exp) => {
    setExpense({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      date: exp.date,
      paymentMethod: exp.paymentMethod,
    });
    setEditId(exp.id);
  };

  return (
    <div className="container">
      <h1 className="heading">💰 Budget Tracker</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* form */}
      <form onSubmit={handleSubmit} className="form">
        <label>Expense Title</label>
        <input
          type="text"
          name="title"
          value={expense.title}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          required
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
        />

        <label>Payment Method</label>
        <select
          name="paymentMethod"
          value={expense.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select Method</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Online">Online</option>
        </select>

        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setExpense({
                title: "",
                category: "",
                amount: "",
                date: "",
                paymentMethod: "",
              });
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* expense table */}
      <h2 className="heading">All Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>{exp.category}</td>
                <td>${exp.amount}</td>
                <td>{exp.date}</td>
                <td>{exp.paymentMethod}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(exp)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(exp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
