import { combineReducers } from 'redux';
import tickets from "./ticketReducer";
import users from "./userReducer";

export default combineReducers({
  tickets,
  users
});
