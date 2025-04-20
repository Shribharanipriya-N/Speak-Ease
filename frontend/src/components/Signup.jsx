import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import signup from "../images/SignUp.jpeg";
import axios from "axios";
import { toast } from "react-toastify";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill all details");
    }

    axios
      .post("http://localhost:4000/register", { name, email, password })
      .then((result) => {
        if (result.data.message === "Email Already Found") {
          return toast.error(result.data.message);
        } else {
          sessionStorage.setItem("token", result.data.token);
          toast.success(result.data.message);
          navigate("/home");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="signupContainer">
      <div className="signupLeft">
        <h1
          className="gradient-signup-text1"
          style={{
            fontSize: "50px",
            marginLeft: "200px",
            marginBottom: "0px",
            fontWeight: "bold",
            lineHeight: "1.5",
          }}
        >
          WELCOME TO
        </h1>
        <h1
          className="gradient-signup-text2"
          style={{
            fontSize: "50px",
            textAlign: "end",
            marginRight: "35px",
            marginTop: "0px",
            marginBottom: "40px",
            fontWeight: "bold",
            lineHeight: "1.5",
          }}
        >
          SPEAK EASE
        </h1>
        <form onSubmit={handleSubmit} style={{ marginLeft: "100px" }}>
          <div className="form-group">
            <label
              htmlFor="email"
              style={{
                marginLeft: "100px",
                fontWeight: "bold",
                fontSize: "35px",
              }}
              className="my-text-style-signup"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              style={{ marginLeft: "131px", height: "58px" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="username"
              style={{
                marginLeft: "100px",
                fontSize: "35px",
                fontWeight: "bold",
              }}
              className="my-text-style"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              style={{ marginLeft: "55px", height: "58px" }}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              style={{
                marginLeft: "100px",
                fontSize: "35px",
                fontWeight: "bold",
              }}
              className="my-text-style"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              style={{ marginLeft: "60px", height: "58px" }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="signupbt"
            style={{ fontWeight: "bold" }}
          >
            SignUp
          </button>
        </form>
      </div>
      <div className="signupRight">
        <img src={signup} alt="Signup Image" />
      </div>
    </div>
  );
};

export default Signup;
