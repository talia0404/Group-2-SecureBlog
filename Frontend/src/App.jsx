import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register"; 
import Login from "./components/Login"; 
import Navbar from "./components/Navbar";
import Logout from "./components/Logout"

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
