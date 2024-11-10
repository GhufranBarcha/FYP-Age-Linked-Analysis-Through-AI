import Logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import backgroundImage from "../assets/Musify- Landing Page- Dark Mode.png";
const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
    setIsClicked(!isClicked);
  };
  const location = useLocation();
  const { pathname } = location;
  console.log(pathname, "pathnamepathname");

  return (
    <div
      className={` top-0 w-full ${
        pathname === "/register" ||
        pathname === "/login" ||
        pathname === "/dashboard/profile" ||
        pathname === "/dashboard/setting" ||
        pathname === "/dashboard/solution" ||
        pathname === "/dashboard/Exercises" ||
        pathname === "/dashboard/progress" ||
        pathname === "/dashboard/Home" ||
        pathname === "/dashboard/speech" ||
        pathname === "/dashboard/Reports" ||
        pathname === "/dashboard"
          ? "hidden"
          : ""
      }  Header text-center text-xl backdrop-blur relative lg:px-8 ${
        toggle ? "bg-blur-xl" : ""
      }`}>
      <div className={` ${pathname !== "/" ? "hidden" : "flex"}`}>
        <img
          src={backgroundImage}
          alt={backgroundImage}
          className="absolute -z-30 left-[12rem] hidden lg:block top-[-30rem]  "
        />
      </div>
      <div className={`  ${toggle ? "backdrop-blur" : "auto"} `}>
        <nav
          className={`flex px-4 justify-between w-[100%]   items-center py-5  `}>
          <div>
            <a href="/" className="hidden xl:flex">
              <img src={Logo} className=" h-[80px] " alt="" />
            </a>
            <div href="/" className="flex xl:hidden">
              <img src={Logo} className=" h-[32px] " alt="LOGO" />
            </div>
          </div>

          <div className=" lg:space-x-9 hidden xl:flex mt-3">
            <Link
              to="/"
              className={`text-lg item   text-black font-[600] leading-5 } font-[600]`}>
              Home
            </Link>
            <Link
              to="/analysis"
              className={`text-lg item text-black font-[600] leading-5 } `}>
              Analysis
            </Link>
            <Link
              to="/contact"
              className={`text-lg item text-black font-[600] leading-5 } `}>
              Contact
            </Link>
            <Link
              to="/dashboard"
              className={`text-lg item text-black font-[600] leading-5 } `}>
              Dashboard
            </Link>
          </div>
          <div className="lg:space-x-10 space-x-1">
            <Link
              to="/login"
              className="lg:py-2 py-1 lg:px-8 px-4  lg:text-lg text-sm item text-black font-[600] leading-5 ">
              Sign In
            </Link>
            <Link
              to="/register"
              className="lg:py-2 py-1 lg:px-8 px-4 bg-[#AB5CF5] lg:text-lg text-sm item text-white font-[600] leading-5 ">
              Register
            </Link>
          </div>
          <div className="flex xl:hidden">
            <button onClick={handleToggle}>
              {toggle ? (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 34 26"
                  fill="#000"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M29.6859 22.8285L6.85742 0L4.02899 2.82843L26.8575 25.6569L29.6859 22.8285Z"
                    fill="black"
                  />
                  <path
                    d="M26.6859 0.171523L3.85742 23L6.68585 25.8284L29.5143 2.99995L26.6859 0.171523Z"
                    fill="black"
                  />
                </svg>
              ) : (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 34 26"
                  fill="#000"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M33.1418 10.6785H0.857422V14.6785H33.1418V10.6785Z"
                    fill="black"
                  />
                  <path d="M33.1418 0H0.857422V4H33.1418V0Z" fill="black" />
                  <path
                    d="M33.1418 21.3564H0.857422V25.3564H33.1418V21.3564Z"
                    fill="black"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>
        {toggle && (
          <div className=" space-y-[50px] px-4 pt-10 text-center  flex flex-col xl:hidden items-start w-full justify-center">
            <div className="flex flex-col text-start lg:space-x-8  space-y-12">
              <Link
                to="/"
                className={`text-lg item   text-black font-[600] leading-5 } font-[600]`}>
                Home
              </Link>
              <Link
                to="/analysis"
                className={`text-lg item text-black font-[600] leading-5 } `}>
                Analysis
              </Link>
              <Link
                to="/contact"
                className={`text-lg item text-black font-[600] leading-5 } `}>
                Contact
              </Link>
              <Link
                to="/dashboard"
                className={`text-lg item text-black font-[600] leading-5 } `}>
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
