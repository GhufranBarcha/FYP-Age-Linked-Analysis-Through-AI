import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import "./App.css";
import Analysis from "./pages/Analysis";
import Contact from "./pages/ContactUs";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/DashboardPages/Profile";
import Solution from "./components/DashboardPages/Solution";
import Speech from "./components/DashboardPages/Speech";
import Setting from "./components/DashboardPages/Setting";
import Progress from "./components/DashboardPages/Progress";

import ViewReports from "./components/DashboardPages/ViewReports";
import ProtectedRoute from "../ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
          {/* Nested routes within the dashboard */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="solution"
            element={
              <ProtectedRoute>
                <Solution />
              </ProtectedRoute>
            }
          />
          <Route
            path="speech"
            element={
              <ProtectedRoute>
                <Speech />
              </ProtectedRoute>
            }
          />
          <Route
            path="setting"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute>
                <ViewReports />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
