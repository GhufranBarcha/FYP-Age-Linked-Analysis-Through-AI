import image1 from "../assets/login.png";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { auth, db } from "../auth/config"; // import the auth instance from Firebase config
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { doc, setDoc } from "firebase/firestore";
// Define the validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Register() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(loading);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    event.preventDefault();
    const { name, email, password } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with the name
      await updateProfile(user, {
        displayName: name,
      });

      // Store the user token in local storage
      const token = await user.getIdToken();
      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        photo: user.photoURL || null, // Include photo if available
        createdAt: new Date().toISOString(), // Optional: Store the registration date
      });
      toast.success("Registration successful!");

      const tokenLocal = localStorage.getItem("userToken");
      setCurrentUser(true);
      if (currentUser || tokenLocal) {
        return navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Failed to register");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex justify-between">
        <div className="w-full">
          <div className="p-8">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center items-center flex-col">
              <h1 className="font-[900] mt-[5rem] text-5xl text-center">
                SIGN UP
              </h1>
              <div className="flex flex-col mt-10">
                <label htmlFor="name" className="text-xl pb-2">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your Name"
                    {...register("name")}
                    className="focus:outline-none py-3 px-[10px] w-[28rem] rounded-[10px] bg-[#F0EDFFCC] placeholder:text-[#6F757E] placeholder:text-lg placeholder:font-normal"
                  />
                  <p className="text-red-500">{errors.name?.message}</p>
                </div>
              </div>

              <div className="flex flex-col mt-10">
                <label htmlFor="email" className="text-xl pb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    {...register("email")}
                    className="focus:outline-none py-3 px-[10px] w-[28rem] rounded-[10px] bg-[#F0EDFFCC] placeholder:text-[#6F757E] placeholder:text-lg placeholder:font-normal"
                  />
                  <p className="text-red-500">{errors.email?.message}</p>
                </div>
              </div>

              <div className="flex flex-col mt-10">
                <label htmlFor="password" className="text-xl pb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your Password"
                    {...register("password")}
                    className="focus:outline-none py-3 px-[10px] w-[28rem] rounded-[10px] bg-[#F0EDFFCC] placeholder:text-[#6F757E] placeholder:text-lg placeholder:font-normal"
                  />
                  <p className="text-red-500">{errors.password?.message}</p>
                </div>
              </div>

              <button
                type="submit"
                className="text-lg w-[37%] font-bold text-white bg-purple-600 py-4 rounded-2xl mt-8 px-10">
                Sign Up
              </button>

              <div className="flex justify-end items-end text-end mt-5">
                <p>
                  Already have an account?
                  <button type="submit">
                    {" "}
                    <Link to="/login" className="text-[#2e2bdf] ml-2">
                      Login
                    </Link>
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
        <div className="w-[60%] hidden lg:flex">
          <img
            src={image1}
            alt="Login Illustration"
            className="h-[54rem] w-full"
          />
        </div>
      </div>
    </>
  );
}
