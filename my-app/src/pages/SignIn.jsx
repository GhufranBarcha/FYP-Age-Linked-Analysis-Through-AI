import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../auth/config"; // Import the auth object from config.js
import image1 from "../assets/login.png";
import logo from "../assets/logo.png";
import google from "../assets/google 1.png";

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Define the schema for validation using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      // Store token in local storage if needed
      const token = await auth.currentUser.getIdToken();
      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", auth.currentUser.uid);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      // Store token in local storage
      console.log(user);
      localStorage.setItem("userToken", user.refreshToken);
      localStorage.setItem("userId", user.uid);

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User does not exist, create a new user document
        await setDoc(userDocRef, {
          name: user.displayName || null,
          email: user.email || null,
          photo: user.photoURL || null, // Include photo if available
          createdAt: new Date().toISOString(), // Store the registration date
        });
        console.log("User created in Firestore:", user.uid);
      } else {
        console.log("User already exists in Firestore:", user.uid);
      }

      toast.success("Successfully logged in with Google!");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message); // Display error message
    }
  };
  return (
    <>
      <Toaster />
      <div className="flex justify-between ">
        <div className="w-full">
          <div className="p-8">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center items-center flex-col">
              <h1 className="font-[900] mt-[5rem] text-5xl text-center">
                Login
              </h1>
              <div className="flex flex-col mt-10">
                <label htmlFor="Email" className="text-xl pb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    {...register("email")}
                    className="focus:outline-none py-3 px-[10px] w-[28rem] rounded-[10px] bg-[#F0EDFFCC] placeholder:text-[#6F757E] placeholder:text-lg placeholder:font-normal"
                  />
                  <div className="absolute right-[1rem] top-[1rem]">
                    <svg
                      width="22"
                      height="18"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 6.47533L0.01 0H15.99L8 6.47533ZM8 8.19133L0 1.708V12H16V1.708L8 8.19133Z"
                        fill="#6F757E"
                      />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col mt-10">
                <label htmlFor="Password" className="text-xl pb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  {...register("password")}
                  className="focus:outline-none py-4 px-[10px] w-[28rem] rounded-[10px] bg-[#F0EDFFCC] placeholder:text-[#6F757E] placeholder:text-lg placeholder:font-normal"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end items-end text-end mt-5">
                <p>
                  Not Registered Yet?
                  <Link to="/register" className="text-[#2e2bdf] ml-2">
                    Create an Account
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="text-lg font-bold bg-blue-500 text-white py-4 rounded-2xl mt-8 px-10"
                disabled={loading}>
                {loading ? "Logging in..." : "Login Now"}
              </button>

              <div className="border-2 px-[9.8rem] mt-[2rem] py-2 rounded-2xl border-[#F0EDFF]">
                <p>
                  <span className="font-bold text-lg">Login</span> with Others
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex justify-center items-center space-x-7 mt-[1.5rem]">
                  <img src={google} alt="Google login" />
                  <p>
                    Login with <span className="font-bold text-lg">Google</span>
                  </p>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-[60%] hidden lg:flex">
          <img
            src={image1}
            alt="Background"
            className="h-[54rem] lg:flex hidden w-full"
          />
        </div>
      </div>
    </>
  );
}
