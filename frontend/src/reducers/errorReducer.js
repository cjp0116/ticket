const INITIAL_STATE = {
  errors: [],
};

function errorReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_ERRORS": {
      return { errors: action.errors, isOpen: true };
    };
    case "HIDE_ERRORS": {
      return { errors: action.errors, isOpen: false };
    };
    case 'CLEAR_ERRORS': {
      return  { errors : [] }
    }
    default:
      return state;
  }
}

export default errorReducer;
