import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import {
  deleteUsersFailed,
  deleteUsersStart,
  deleteUsersSuccess,
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
} from "./userSlice";

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

export const getAllUsers = async (accessToken, dispatch) => {
  try {
    dispatch(getUsersStart());
    const res = await axios.get("/v1/user", {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    dispatch(getUsersFailed());
  }
};

export const deleteUser = async (accessToken, dispatch, id) => {
  try {
    dispatch(deleteUsersStart());
    const res = await axios.delete(`/v1/user/${id}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(deleteUsersSuccess(res.data));
  } catch (error) {
    dispatch(deleteUsersFailed(error.response.data));
  }
};
