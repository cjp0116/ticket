const initialState = [];

function users(state = initialState, action) {
  switch(action.type) {
    case 'RESET_ALL': {
      return [...initialState]
    };
    case 'LOAD_USERS': {
      return [...state, ...action.payload ]
    };
    case 'GET_USER': {
      return action.payload;
    };
    case 'DELETE_USER': {
      return state.filter(u => u.username !== action.payload);
    };
    default: 
      return state
  }
};

export default users;