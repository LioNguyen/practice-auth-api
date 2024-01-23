import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import "./home.css";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const userData = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);

  let axiosJWT = axios.create();

  const refreshToken = async () => {
    try {
      const res = await axios.post("/v1/auth/refresh", {
        withCredential: true,
      });
      return res.data;
    } catch (error) {
      console.log("🚀 @log ~ refreshToken ~ error:", error);
    }
  };

  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers["token"] = "Bearer " + data.accessToken;
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    getAllUsers(user?.accessToken, dispatch, axiosJWT);
  }, []);

  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  };

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.isAdmin ? "Admin" : "User"}`}
      </div>
      <div className="home-userlist">
        {(userData || [])?.map((user) => {
          return (
            <div key={user._id} className="user-container">
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user"
                onClick={() => handleDelete(user._id)}
              >
                {" "}
                Delete{" "}
              </div>
            </div>
          );
        })}
      </div>
      <div className="errorMessage">{msg}</div>
    </main>
  );
};

export default HomePage;
