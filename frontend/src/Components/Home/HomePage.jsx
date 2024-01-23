import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createAxios } from "../../createInstance";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { loginSuccess } from "../../redux/authSlice";
import "./home.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const userData = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

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
