import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register"; 
import Login from "./components/Login"; 
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;
