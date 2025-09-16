import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader.svg";
import "./home.css";
import axios from "axios";
import { apiurl } from "../../config/config";
import PrivateRoute from "../../config/protectedRoute";
import { BiError } from "react-icons/bi";
import { BlinkLoader } from "../../components/loader";
import { setCookie } from "../../config/webStorage";

function Login() {
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("store");
  const [loginloading, setloginloading] = useState(false);
  const navigate = useNavigate();

  // Check if user data is available in local storage when the component loads
  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem("userData"));
  //   const adminData = JSON.parse(localStorage.getItem("adminData"));

  //   if (userData) {
  //     navigate("/dashboard");
  //   } else if (adminData) {
  //     navigate("/admin/admindashboard");
  //   }
  // }, [navigate]);

  // const handleValidation = (event) => {
  //   let formIsValid = true;

  //   if (email == "") {
  //     formIsValid = false;
  //     setemailError("Email Not Valid");
  //     return false;
  //   } else {
  //     setemailError("");
  //     formIsValid = true;
  //   }

  //   if (password == "") {
  //     formIsValid = false;
  //     setpasswordError("Please enter password");
  //     return false;
  //   } else {
  //     setpasswordError("");
  //     formIsValid = true;
  //   }

  //   return formIsValid;
  // };

  // const loginAdmin = async (e) => {
  //   setloginloading(true);
  //   e.preventDefault();
  //   // if (handleValidation()) {
  //   let payload = { email: adminEmail, password: adminPassword };

  //   try {
  //     const response = await fetch(
  //       "https://blackberry-9ab3116e64.herokuapp.com/adminlogin",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       console.log(responseData, "responswDataaaa");
  //       if (responseData?.userCheck) {
  //         console.log("Login successful");
  //         const userData = {
  //           userId: responseData?.userCheck?._id,
  //           userName: responseData?.userCheck?.name,
  //           userEmail: responseData?.userCheck?.email,
  //           authToken: responseData?.token,
  //         };
  //         localStorage.setItem("adminData", JSON.stringify(userData));
  //         window.location.href = "/admin/admindashboard";
  //         setloginloading(false);
  //       } else {
  //         setloginloading(false);
  //         alert("Authentication failed ");
  //       }
  //     } else {
  //       setloginloading(false);
  //       console("Authentication failed");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     setloginloading(false);
  //   }
  //   // }
  // };

  // const loginStore = async (e) => {
  //   setloginloading(true);
  //   e.preventDefault();
  //   if (handleValidation()) {
  //     let payload = { email, password };

  //     try {
  //       const response = await fetch(
  //         "https://blackberry-9ab3120e64.herokuapp.com/user/storeuserlogin",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(payload),
  //         }
  //       );

  //       if (response.ok) {
  //         const responseData = await response.json();
  //         console.log(responseData, "responseData");
  //         console.log(emailError);
  //         console.log(passwordError);
  //         if (
  //           responseData.userCheck &&
  //           responseData.userCheck.email === email
  //         ) {
  //           console.log("Login successful");
  //           const userData = {
  //             userId: responseData.userCheck._id,
  //             userName: responseData.userCheck.name,
  //             userEmail: responseData.userCheck.email,
  //             authToken: responseData.token,
  //           };
  //           localStorage.setItem("userData", JSON.stringify(userData));
  //           setloginloading(false);
  //           // Redirect to the dashboard here
  //           window.location.href = "/dashboard";
  //         } else {
  //           setloginloading(false);
  //           alert("Invalid credentials");
  //         }
  //       } else {
  //         setloginloading(false);
  //         console.log("Authentication failed");
  //         console.log(response);
  //       }
  //     } catch (error) {
  //       setloginloading(false);
  //       console.error("An error occurred:", error);
  //     }
  //   }
  // };

  const HandleUser = (type) => {
    setLoginType(type);
  };
  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setloginloading(true);

      let data = JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${apiurl}/user/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response.data.success === false) {
            setError(response.data.message);
            setloginloading(false);
            return;
          }
          setCookie(response.data.token);
          window.location.reload();
        })
        .catch((error) => {
          setloginloading(false);
          console.log(error);
        });
    } catch (error) {
      setloginloading(false);
      console.log(error);
    }
  };

  return (
    <section className="login-sectionn login-steps step-one position-relative">
      {/* <button type="button" className="btn btn-outline-dark position-absolute top-0  mt-1 LoginAs" onClick={HandleUser}>Login as user</button> */}
      <div className="container">
        <div className="row formContainer">
          <div className="col-md-6 discount-banner ">
            <img
              src="https://i.ibb.co/ng7v340/Screenshot-2024-09-26-123622-removebg-preview.png?v=1629974004"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 login-boxx d-flex flex-column justify-content-center align-items-center">
            {/* <div className="d-flex w-100 gap-2 mb-4">
              <button
                type="button"
                className={`btn btn-outline-dark ${loginType === "store" ? "active" : ""
                  }`}
                onClick={() => HandleUser("store")}
              >
                Store
              </button>
              <button
                type="button"
                className={`btn btn-outline-dark ${loginType === "admin" ? "active" : ""
                  }`}
                onClick={() => HandleUser("admin")}
              >
                Admin
              </button>
            </div> */}

            <div className="box w-100 ">
              {/* <h4 className="mb-4"> ADMIN LOGIN</h4> */}
              <form onSubmit={loginHandler}>
                <div className="form-group d-flex flex-column gap-2 ">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control "
                    id="email"
                    required
                    onChange={(event) => setAdminEmail(event.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group d-flex flex-column gap-2">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control "
                    id="password"
                    placeholder="Password"
                    onChange={(event) => setAdminPassword(event.target.value)}
                  />
                  <small
                    id="passworderror"
                    className="text-black form-text mt-2"
                  >
                    {passwordError}
                  </small>
                </div>
                {error && (
                  <div
                    style={{ borderWidth: 1 }} //due to bootstrap won't able to change border color
                    className="bg-red-50 rounded-md border-red-200  text-red-500  text-sm p-3 py-2 flex items-center gap-1"
                  >
                    <BiError />
                    {error}
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center relative">
                  {loginloading ? (
                    <BlinkLoader />
                  ) : (
                    <button className="btn btn-dark mt-3" type="submit">
                      Submit
                    </button>
                  )}
                  <p className="mt-3 pt-2">Forgot password ?</p>
                </div>
              </form>
            </div>

            {/* {loginType === "store" && (
              <div className="box w-100">
                <h4 className="mb-4">STORE LOGIN</h4>
                <form onSubmit={loginStore}>
                  <div className="form-group d-flex flex-column gap-2 ">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control "
                      id="email"
                      required
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter email"
                    />
                    <small id="emailHelp" className="form-text text-black mb-2">
                      {emailError}
                    </small>
                  </div>
                  <div className="form-group d-flex flex-column gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control "
                      id="password"
                      placeholder="Password"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <small
                      id="passworderror"
                      className="text-black form-text mt-2"
                    >
                      {passwordError}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    {loginloading === true ? (
                      <button
                      disabled
                      type="button"
                      className="py-2.5 px-5 me-2 text-sm font-medium text-white bg-black rounded-lg border border-gray-200 hover:bg-black hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700  inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-gray-200 animate-spin "
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                      Logging
                    </button>
                    ) : (
                      <button className="btn btn-dark ">Submit</button>

                    )}
                    <p className="mt-3 pt-2 cursor-pointer text-slate-500 hover:font-bold hover:text-orange-950" onClick={handleForgotPassword}>Forgot password ?</p>
                  </div>
                </form>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
