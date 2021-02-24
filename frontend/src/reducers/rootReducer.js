import { combineReducers } from 'redux';
import ticketReducer from "./ticketReducer";
import userReducer from "./userReducer";

export default combineReducers({
  ticketReducer,
  userReducer
});
