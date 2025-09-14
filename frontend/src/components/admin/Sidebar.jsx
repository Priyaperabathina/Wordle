import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-light"
      style={{ width: "200px", minHeight: "100vh" }}
    >
      <h4>Admin</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/admin/words" className="nav-link">
            Words
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="nav-link">
            Users
          </Link>
        </li>
        <li>
          <Link to="/admin/reports" className="nav-link">
            Reports
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
