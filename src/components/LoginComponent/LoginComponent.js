// LoginComponent.js
import React from "react";
import { useDispatch } from "react-redux";
import { googleLogin, loginUser } from "./redux/authSlice";

const dispatch = useDispatch();

export const handleLogin = (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  dispatch(loginUser({ email, password }));
};

export const handleGoogleLogin = () => {
  dispatch(googleLogin());
};
