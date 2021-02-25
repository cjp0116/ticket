import Api from "../backendAPI";

function getUsers() {
  return async function(dispatch) {
    const users = await Api.request('http://localhost:5000/users');
    dispatch( { type : 'LOAD_USERS', payload : users } )
  };
};

function getUserByUsername(username) {
  return async function(dispatch) {
    const user = await Api.request(`http://localhost:5000/users/${username}`);
    dispatch({ type : 'GET_USER', payload : user }); 
  };
};

function deleteUser(username) {
  return async function(dispatch) {
    const message = await Api.request(`http://localhost:5000/users/${username}`);
    dispatch({ type : 'DELETE_USER', payload : username });
  };
};


export { getUsers, getUserByUsername, deleteUser };