import "./main.scss";
import { useLocation } from "react-router-dom";
const Navbar = () => {
  const location = useLocation();

  // Access the current URL path
  const currentPath = location.pathname;
  const path = currentPath.split("/")[2];

  return (
    <div className="flex lg:flex-row flex-col lg:space-x-[10rem]  items-center p-10">
      <div>
        <h1 className="font-bold text-[35px] text-[#6E39CB] capitalize">
          {path
            ? (path === "speech" && "Speech Reports") ||
              (path === "progress" && "Progress Reports")
              ? (path === "speech" && "Speech Reports") ||
                (path === "progress" && "Progress Reports")
              : path
            : "Dashboard"}
        </h1>
      </div>
      <div className="relative">
        <input
          type="text"
          className="focus:outline-none text-xl border-2 lg:w-[25rem] border-[#DBDCDE] py-2 px-4 rounded-3xl"
          placeholder="search for anything here"
        />

        <div className="absolute right-6 top-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.8568 16.2345L13.203 11.5807C14.0782 10.377 14.5958 8.8965 14.5958 7.2975C14.5958 3.27375 11.322 0 7.2975 0C3.27375 0 0 3.27375 0 7.2975C0 11.322 3.27375 14.595 7.2975 14.595C8.823 14.595 10.2397 14.1247 11.4128 13.3215L16.0912 18L17.8568 16.2345ZM2.1405 7.2975C2.1405 4.4535 4.45425 2.13975 7.29825 2.13975C10.1423 2.13975 12.456 4.4535 12.456 7.2975C12.456 10.1415 10.1423 12.4552 7.29825 12.4552C4.4535 12.4552 2.1405 10.1415 2.1405 7.2975Z"
              fill="#89868D"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
