import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/admin/Sidebar";
import AdminHome from "./components/admin/AdminHome";
import AdminWordsPage from "./components/admin/AdminWordsPage";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/admin/words" element={<AdminWordsPage />} />
            <Route
              path="/admin/users"
              element={<div className="p-4">Users Page</div>}
            />
            <Route
              path="/admin/reports"
              element={<div className="p-4">Reports Page</div>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
