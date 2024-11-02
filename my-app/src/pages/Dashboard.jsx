import Sidebar from "../components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/NavBar";
import "../components/Dashboard/dashboard.scss";
import { Outlet, useLocation } from "react-router-dom"; // Import Outlet to render the child routes
import Home from "../components/DashboardPages/Home";

const Dashboard = () => {
  const location = useLocation();
  const { pathname } = location;
  console.log(pathname, "pathnamepathname");
  return (
    <div className="home ]">
      <Sidebar />
      <div className="homeContainer space-y-10 lg:space-y-0 ">
        <Navbar />
        <div className="widgets">
          {/* This is where the nested components will be rendered */}
          {pathname === "/dashboard" ? <Home /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
