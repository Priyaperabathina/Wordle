import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="p-4">
      <h2>Welcome, Admin</h2>
      <p>Choose an option:</p>
      <div className="d-flex flex-column gap-3">
        <Link to="/admin/words" className="btn btn-primary">
          Manage Words
        </Link>
        <Link to="/admin/users" className="btn btn-secondary">
          Manage Users
        </Link>
        <Link to="/admin/reports" className="btn btn-info">
          View Reports
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
