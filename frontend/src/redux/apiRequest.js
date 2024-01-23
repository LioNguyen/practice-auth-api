import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
  try {
    dispatch(loginStart());
    const res = await axios.post("/v1/auth/login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    console.log("🚀 @log ~ loginUser ~ error:", error);

    dispatch(loginFailed);
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  try {
    dispatch(registerStart());
    const res = await axios.post("/v1/auth/register", user);
    dispatch(registerSuccess(res.data));
    navigate("/login");
  } catch (error) {
    console.log("🚀 @log ~ registerUser ~ error:", error);
    dispatch(registerFailed());
  }
};
