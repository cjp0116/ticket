import Api from "../backendAPI";
import { setErrors } from "./errorActions";

function createUser(data) {
  return async function (dispatch) {
    try {
      const user = await Api.request(
        "http://localhost:5000/register",
        { ...data },
        "POST"
      );
      dispatch({ type: "ADD_USER", user: user.data.user });
    } catch (e) {
      dispatch(setErrors(e));
    }
  };
}

function getUsers() {
  return async function (dispatch) {
    try {
      const users = await Api.request("http://localhost:5000/users");
      dispatch({ type: "LOAD_USERS", users: users.data.users });
    } catch (e) {
      dispatch(setErrors(e));
    }
  };
}

function getUserByUsername(username) {
  return async function (dispatch) {
    const user = await Api.request(`http://localhost:5000/users/${username}`);
    dispatch({ type: "GET_USER", payload: user });
  };
}

function deleteUser(username) {
  return async function (dispatch) {
    try {
      const message = await Api.request(
        `http://localhost:5000/users/${username}`, {}, 'DELETE'
      );
      dispatch({ type: "DELETE_USER", payload: username });
    } catch (e) {
      dispatch(setErrors(e))
      console.error(e);
    }
  };
}

function updateUser(username, data) {
  return async function(dispatch) {
    try {
      const res = await Api.request(`http://localhost:5000/users/${username}`, { ...data }, 'PATCH');
      const updatedUser = res.data.user;
      dispatch({
        type : 'UPDATE_USER',
        user : updatedUser,
        username
      })
    } catch(e) {
      console.error(e);
      dispatch(setErrors(e));
    }
  }
}

export { getUsers, getUserByUsername, deleteUser, createUser, updateUser };
