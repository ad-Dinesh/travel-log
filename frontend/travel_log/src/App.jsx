import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import AddStory from "./pages/AddStory/AddStory";
import EditStory from "./pages/EditStory/EditStory";
import ViewStory from "./pages/ViewStory/ViewStory";

// Protect routes — redirect to login if no token
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Home /></PrivateRoute>}
        />
        <Route
          path="/add-story"
          element={<PrivateRoute><AddStory /></PrivateRoute>}
        />
        <Route
          path="/edit-story/:id"
          element={<PrivateRoute><EditStory /></PrivateRoute>}
        />
        <Route
          path="/story/:id"
          element={<PrivateRoute><ViewStory /></PrivateRoute>}
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;