import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register"; 
import Login from "./components/Login"; 
import Navbar from "./components/Navbar";
import Logout from "./components/Logout"
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./components/Dashboard"; // <- create this

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={Logout}/>
      </Routes>
    </Router>
  );
}

export default App;
