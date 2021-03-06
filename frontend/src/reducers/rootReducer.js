import { combineReducers } from 'redux';
import tickets from "./ticketReducer";
import users from "./userReducer";
import errors from "./errorReducer";

export default combineReducers({
  tickets,
  users,
  errors
});
