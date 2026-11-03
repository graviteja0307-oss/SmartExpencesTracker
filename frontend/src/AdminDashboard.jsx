
import React, { useState } from "react";
import "./AdminDashboard.css";

const ADMIN_EMAIL = "admin@expense.com";
const ADMIN_PASSWORD = "admin123";

const loadData = (key, fallback = []) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
};

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState(() =>
    loadData("users", loadData("registeredUsers"))
  );

  const [transactions] = useState(() =>
    loadData(
      "transactions",
      loadData("expenses", loadData("expenseData"))
    )
  );

  const [categories, setCategories] = useState(() =>
    loadData("expenseCategories", [
      "Food",
      "Transport",
      "Shopping",
      "Bills",
      "Health",
      "Other",
    ])
  );

  const [newCategory, setNewCategory] = useState("");

  const isBlocked = (user) =>
    user.blocked === true || user.status === "blocked";

  const getEmail = (user) =>
    user.email || user.username || "No email";

  const getAmount = (transaction) =>
    Number(transaction.amount ?? transaction.total ?? 0) || 0;

  const getCategory = (transaction) =>
    transaction.category || transaction.type || "Other";

  const totalSpent = transactions.reduce(
    (sum, transaction) => sum + getAmount(transaction),
    0
  );

  const activeUsers = users.filter(
    (user) => !isBlocked(user)
  ).length;

  const filteredUsers = users.filter((user) =>
    `${user.name || user.fullName || ""} ${getEmail(user)}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const login = (event) => {
    event.preventDefault();

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid email or password.");
    }
  };

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const toggleBlock = (user) => {
    if (getEmail(user).toLowerCase() === ADMIN_EMAIL) {
      alert("You cannot block the administrator.");
      return;
    }

    const updatedUsers = users.map((item) =>
      item === user
        ? {
            ...item,
            blocked: !isBlocked(item),
            status: isBlocked(item) ? "active" : "blocked",
          }
        : item
    );

    saveUsers(updatedUsers);
  };

  const deleteUser = (user) => {
    if (!window.confirm(`Delete ${getEmail(user)}?`)) return;

    saveUsers(users.filter((item) => item !== user));
  };

  const addCategory = (event) => {
    event.preventDefault();

    const name = newCategory.trim();

    if (!name) return;

    if (
      categories.some(
        (category) =>
          category.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert("This category already exists.");
      return;
    }

    const updated = [...categories, name];

    setCategories(updated);
    localStorage.setItem(
      "expenseCategories",
      JSON.stringify(updated)
    );
    setNewCategory("");
  };

  const removeCategory = (category) => {
    const updated = categories.filter(
      (item) => item !== category
    );

    setCategories(updated);
    localStorage.setItem(
      "expenseCategories",
      JSON.stringify(updated)
    );
  };

  if (!loggedIn) {
    return (
      <div className="admin-login-page">
        <form className="admin-login-card" onSubmit={login}>
          <div className="admin-logo">ST</div>
          <p className="admin-eyebrow">SMART EXPENSE TRACKER</p>
          <h1>Admin Login</h1>
          <p className="admin-muted">
            Sign in to manage your expense tracker.
          </p>

          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter admin email"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          {error && <p className="admin-error">{error}</p>}

          <button className="admin-primary" type="submit">
            Sign In
          </button>

          <p className="admin-demo">
            Demo: admin@expense.com / admin123
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-logo">ST</span>
          <span>
            SpendSmart
            <small>ADMIN PANEL</small>
          </span>
        </div>

        <p className="admin-nav-title">MENU</p>

        {[
          "Overview",
          "Users",
          "Transactions",
          "Categories",
        ].map((item) => (
          <button
            key={item}
            className={`admin-nav ${
              tab === item ? "active" : ""
            }`}
            onClick={() => setTab(item)}
          >
            {item === "Overview" && "▦"}
            {item === "Users" && "♙"}
            {item === "Transactions" && "⇄"}
            {item === "Categories" && "◈"}
            <span>{item}</span>
          </button>
        ))}

        <div className="admin-sidebar-bottom">
          <strong>Administrator</strong>
          <small>{ADMIN_EMAIL}</small>
          <button
            className="admin-logout"
            onClick={() => setLoggedIn(false)}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>Admin / </span>
            <strong>{tab}</strong>
          </div>
          <span className="admin-online">● Online</span>
        </header>

        <section className="admin-content">
          <h1>{tab}</h1>
          <p className="admin-muted">
            Manage and monitor your Smart Expense Tracker.
          </p>

          {tab === "Overview" && (
            <>
              <div className="admin-stats">
                <article className="admin-stat">
                  <span>Total Users</span>
                  <strong>{users.length}</strong>
                  <small>{activeUsers} active accounts</small>
                </article>

                <article className="admin-stat">
                  <span>Transactions</span>
                  <strong>{transactions.length}</strong>
                  <small>Recorded transactions</small>
                </article>

                <article className="admin-stat">
                  <span>Total Amount</span>
                  <strong>
                    ₹{totalSpent.toLocaleString("en-IN")}
                  </strong>
                  <small>Sum of recorded amounts</small>
                </article>

                <article className="admin-stat">
                  <span>Categories</span>
                  <strong>{categories.length}</strong>
                  <small>Available categories</small>
                </article>
              </div>

              <div className="admin-panel">
                <h2>Recent Users</h2>
                {users.length === 0 ? (
                  <p className="admin-empty">
                    No user records found in Local Storage.
                  </p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(-5).reverse().map((user, index) => (
                          <tr key={user.id || getEmail(user) + index}>
                            <td>
                              {user.name || user.fullName || "User"}
                            </td>
                            <td>{getEmail(user)}</td>
                            <td>
                              <span
                                className={
                                  isBlocked(user)
                                    ? "admin-badge blocked"
                                    : "admin-badge"
                                }
                              >
                                {isBlocked(user) ? "Blocked" : "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "Users" && (
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <h2>Registered Users</h2>
                <input
                  className="admin-search"
                  placeholder="Search users..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id || getEmail(user) + index}>
                        <td>
                          {user.name || user.fullName || "User"}
                        </td>
                        <td>{getEmail(user)}</td>
                        <td>
                          {isBlocked(user) ? "Blocked" : "Active"}
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              className="admin-small-button"
                              onClick={() => toggleBlock(user)}
                            >
                              {isBlocked(user) ? "Unblock" : "Block"}
                            </button>
                            <button
                              className="admin-small-button danger"
                              onClick={() => deleteUser(user)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <p className="admin-empty">No users found.</p>
              )}
            </div>
          )}

          {tab === "Transactions" && (
            <div className="admin-panel">
              <h2>Transaction Records</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id || index}>
                        <td>
                          {transaction.date ||
                            transaction.createdAt ||
                            "—"}
                        </td>
                        <td>{getCategory(transaction)}</td>
                        <td>
                          {transaction.description ||
                            transaction.title ||
                            transaction.note ||
                            "—"}
                        </td>
                        <td>
                          ₹{getAmount(transaction).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.length === 0 && (
                <p className="admin-empty">
                  No transaction records found.
                </p>
              )}
            </div>
          )}

          {tab === "Categories" && (
            <div className="admin-panel">
              <h2>Manage Categories</h2>

              <form
                className="admin-category-form"
                onSubmit={addCategory}
              >
                <input
                  value={newCategory}
                  onChange={(event) =>
                    setNewCategory(event.target.value)
                  }
                  placeholder="Enter category name"
                  required
                />
                <button className="admin-primary" type="submit">
                  Add Category
                </button>
              </form>

              <div className="admin-category-list">
                {categories.map((category) => (
                  <div className="admin-category" key={category}>
                    <span>{category}</span>
                    <button
                      onClick={() => removeCategory(category)}
                      aria-label={`Remove ${category}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
