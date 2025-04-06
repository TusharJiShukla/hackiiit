import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import Owner from "./pages/Owner";
import FashionAPI from "./pages/FashionAPI";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<UserDashboard />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/owner" element={<Owner/>} />
        <Route path="/fashionapi" element={<FashionAPI/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
