
import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState(
    window.location.pathname === "/admin" ? "admin" : "home"
  );

  const openAdmin = () => {
    window.history.pushState({}, "", "/admin");
    setPage("admin");
  };

  const openHome = () => {
    window.history.pushState({}, "", "/");
    setPage("home");
  };

  window.onpopstate = () => {
    setPage(
      window.location.pathname === "/admin" ? "admin" : "home"
    );
  };

  if (page === "admin") {
    return (
      <>
        <button
          onClick={openHome}
          style={{
            position: "fixed",
            top: 10,
            right: 15,
            zIndex: 9999,
            padding: "9px 14px",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "white",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
        <AdminDashboard />
      </>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 24,
        background: "#f5f6fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Smart Expense Tracker</h1>
      <p>Your expense tracker project is running.</p>
      <button
        onClick={openAdmin}
        style={{
          padding: "13px 22px",
          background: "#705be4",
          color: "white",
          border: 0,
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Open Admin Dashboard
      </button>
    </main>
  );
}

export default App;
